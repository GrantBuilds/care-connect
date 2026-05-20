const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

const getPaystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || ''}`,
  'Content-Type': 'application/json'
});

const assertPaystackConfigured = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    const error = new Error('PAYSTACK_SECRET_KEY is not configured');
    error.statusCode = 500;
    throw error;
  }
};

const parsePaystackResponse = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Paystack request failed');
    error.statusCode = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const initializeMobileMoneyCharge = async ({ email, amount, currency, phone, provider, metadata, reference }) => {
  assertPaystackConfigured();

  const response = await fetch(`${PAYSTACK_BASE_URL}/charge`, {
    method: 'POST',
    headers: getPaystackHeaders(),
    body: JSON.stringify({
      email,
      amount,
      currency,
      reference,
      mobile_money: {
        phone,
        provider
      },
      metadata
    })
  });

  return parsePaystackResponse(response);
};

const verifyTransaction = async (reference) => {
  assertPaystackConfigured();

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: getPaystackHeaders()
  });

  return parsePaystackResponse(response);
};

module.exports = {
  initializeMobileMoneyCharge,
  verifyTransaction
};
