
const express = require('express');
const prisma = require('../db/prisma');
const authenticateToken = require('../middleware/auth');
const { initializeMobileMoneyCharge, verifyTransaction } = require('../services/paystack');

const router = express.Router();

const PAYSTACK_CURRENCY = process.env.PAYSTACK_CURRENCY || 'GHS';
const VERIFY_AFTER_MS = 180000;

const MOBILE_MONEY_PROVIDERS = [
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'atl', label: 'AirtelTigo Money' },
  { id: 'vod', label: 'Telecel Cash' }
];

const BILLING_PLANS = [
  {
    id: 'basic_monthly',
    name: 'Basic',
    amount: parseInt(process.env.BILLING_BASIC_MONTHLY_AMOUNT || '9900', 10),
    currency: PAYSTACK_CURRENCY,
    durationDays: 30
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    amount: parseInt(process.env.BILLING_PRO_MONTHLY_AMOUNT || '19900', 10),
    currency: PAYSTACK_CURRENCY,
    durationDays: 30
  }
];

const ACTIVE_STATUSES = new Set(['success', 'active']);
const FAILED_STATUSES = new Set(['failed', 'abandoned', 'reversed']);

const getPlanById = (planId) => BILLING_PLANS.find((plan) => plan.id === planId);
const getProviderById = (providerId) => MOBILE_MONEY_PROVIDERS.find((provider) => provider.id === providerId);

const buildReference = (managerId) => `CC-GH-${managerId}-${Date.now()}`;

const normalizePhone = (phone) => `${phone || ''}`.trim();

const isValidGhanaPhone = (phone) => {
  const normalized = phone.replace(/\s+/g, '');
  return /^(\+233|233|0)\d{9}$/.test(normalized);
};

const computeExpiryDate = (currentExpiry, durationDays) => {
  const now = new Date();
  const baseDate = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
  const expiresAt = new Date(baseDate);
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  return expiresAt;
};

const normalizeGatewayStatus = (status) => {
  if (!status) return 'pending';
  if (ACTIVE_STATUSES.has(status)) return 'success';
  if (FAILED_STATUSES.has(status)) return 'failed';
  if (status === 'pay_offline' || status === 'pending') return 'pending';
  return status;
};

const serializeForJson = (value) => JSON.parse(JSON.stringify(value, (_, currentValue) => (
  typeof currentValue === 'bigint' ? currentValue.toString() : currentValue
)));

const syncManagerSubscription = async (tx, managerId, plan) => {
  const manager = await tx.managers.findUnique({
    where: { manager_id: managerId },
    select: { subscription_expires_at: true }
  });

  const expiresAt = computeExpiryDate(manager?.subscription_expires_at, plan.durationDays);

  await tx.managers.update({
    where: { manager_id: managerId },
    data: {
      subscription_plan: plan.id,
      subscription_status: 'active',
      subscription_expires_at: expiresAt
    }
  });

  return expiresAt;
};

const formatStatusResponse = (manager) => {
  const expiresAt = manager.subscription_expires_at ? new Date(manager.subscription_expires_at) : null;
  const isExpired = expiresAt && expiresAt <= new Date();
  const subscriptionStatus = isExpired ? 'expired' : (manager.subscription_status || 'inactive');

  return {
    managerId: manager.manager_id,
    billingEmail: manager.billing_email || manager.email,
    subscription: {
      planId: manager.subscription_plan,
      status: subscriptionStatus,
      expiresAt
    }
  };
};

router.get('/plans', authenticateToken, async (req, res) => {
  res.json({
    country: 'Ghana',
    currency: PAYSTACK_CURRENCY,
    providers: MOBILE_MONEY_PROVIDERS,
    plans: BILLING_PLANS
  });
});

router.get('/status', authenticateToken, async (req, res) => {
  try {
    const manager = await prisma.managers.findUnique({
      where: { manager_id: req.manager.manager_id }
    });

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const latestPayment = await prisma.subscription_payments.findFirst({
      where: { manager_id: req.manager.manager_id },
      orderBy: { created_at: 'desc' }
    });

    res.json(serializeForJson({
      ...formatStatusResponse(manager),
      latestPayment
    }));
  } catch (error) {
    console.error('Error fetching billing status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/mobile-money/charge', authenticateToken, async (req, res) => {
  const { planId, billingEmail, phone, provider } = req.body || {};
  const selectedPlan = getPlanById(planId);
  const selectedProvider = getProviderById(provider);
  const normalizedPhone = normalizePhone(phone);
  const reference = buildReference(req.manager.manager_id);

  if (!selectedPlan) {
    return res.status(400).json({ error: 'Invalid planId' });
  }

  if (!selectedProvider) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  if (!billingEmail || !`${billingEmail}`.trim()) {
    return res.status(400).json({ error: 'billingEmail is required' });
  }

  if (!isValidGhanaPhone(normalizedPhone)) {
    return res.status(400).json({ error: 'A valid Ghana phone number is required' });
  }

  try {
    const paystackResponse = await initializeMobileMoneyCharge({
      email: `${billingEmail}`.trim(),
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      phone: normalizedPhone,
      provider: selectedProvider.id,
      reference,
      metadata: {
        manager_id: req.manager.manager_id,
        plan_id: selectedPlan.id
      }
    });

    const paystackData = paystackResponse?.data || {};

    const payment = await prisma.subscription_payments.create({
      data: {
        manager_id: req.manager.manager_id,
        reference,
        plan_id: selectedPlan.id,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        provider: selectedProvider.id,
        phone: normalizedPhone,
        status: normalizeGatewayStatus(paystackData.status),
        gateway_response: paystackData.gateway_response || paystackResponse?.message || null,
        raw_response: paystackResponse
      }
    });

    await prisma.managers.update({
      where: { manager_id: req.manager.manager_id },
      data: {
        billing_email: `${billingEmail}`.trim(),
        subscription_plan: selectedPlan.id,
        subscription_status: 'pending'
      }
    });

    res.status(201).json({
      reference: payment.reference,
      status: paystackData.status || 'pending',
      display_text: paystackData.display_text || 'Approve this payment on your phone to complete the charge.',
      provider: selectedProvider,
      plan: selectedPlan
    });
  } catch (error) {
    console.error('Error starting mobile money charge:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Unable to start payment',
      details: error.payload || null
    });
  }
});

router.get('/verify/:reference', authenticateToken, async (req, res) => {
  const { reference } = req.params;

  try {
    const payment = await prisma.subscription_payments.findUnique({
      where: { reference }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only access your own payments' });
    }

    const paymentAgeMs = Date.now() - new Date(payment.created_at).getTime();
    const shouldVerifyWithPaystack = !ACTIVE_STATUSES.has(payment.status) && paymentAgeMs >= VERIFY_AFTER_MS;

    if (!shouldVerifyWithPaystack) {
      return res.json(serializeForJson({ payment, verifiedRemotely: false }));
    }

    const verification = await verifyTransaction(reference);
    const data = verification?.data || {};
    const normalizedStatus = normalizeGatewayStatus(data.status);
    const plan = getPlanById(payment.plan_id);

    const updatedPayment = await prisma.$transaction(async (tx) => {
      let expiresAt = payment.expires_at;
      let paidAt = payment.paid_at;

      if (normalizedStatus === 'success' && plan) {
        paidAt = data.paid_at ? new Date(data.paid_at) : new Date();
        expiresAt = await syncManagerSubscription(tx, payment.manager_id, plan);
      }

      return tx.subscription_payments.update({
        where: { reference },
        data: {
          status: normalizedStatus,
          paystack_transaction_id: data.id ? BigInt(data.id) : payment.paystack_transaction_id,
          paid_at: paidAt,
          expires_at: expiresAt,
          gateway_response: data.gateway_response || verification.message || payment.gateway_response,
          raw_response: verification
        }
      });
    });

    res.json(serializeForJson({ payment: updatedPayment, verifiedRemotely: true }));
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Unable to verify payment',
      details: error.payload || null
    });
  }
});

router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));

  if (!secret) {
    console.error('Missing Paystack webhook secret');
    return res.status(500).json({ error: 'Webhook secret is not configured' });
  }

  const computedSignature = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');

  if (!signature || signature !== computedSignature) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  let event;

  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const eventType = event?.event;
  const data = event?.data || {};
  const reference = data.reference;

  if (!reference) {
    return res.status(200).json({ received: true, ignored: true });
  }

  try {
    const payment = await prisma.subscription_payments.findUnique({
      where: { reference }
    });

    if (!payment) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const normalizedStatus = normalizeGatewayStatus(data.status || eventType);
    const plan = getPlanById(payment.plan_id);

    await prisma.$transaction(async (tx) => {
      let expiresAt = payment.expires_at;
      let paidAt = payment.paid_at;

      if (eventType === 'charge.success' && plan) {
        paidAt = data.paid_at ? new Date(data.paid_at) : new Date();
        expiresAt = await syncManagerSubscription(tx, payment.manager_id, plan);
      }

      await tx.subscription_payments.update({
        where: { reference },
        data: {
          status: eventType === 'charge.success' ? 'success' : normalizedStatus,
          paystack_transaction_id: data.id ? BigInt(data.id) : payment.paystack_transaction_id,
          paid_at: paidAt,
          expires_at: expiresAt,
          gateway_response: data.gateway_response || payment.gateway_response,
          raw_response: event
        }
      });
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling Paystack webhook:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
