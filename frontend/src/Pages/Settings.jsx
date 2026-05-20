import React, { useState } from 'react';
import {
    User, Bell, Lock, CreditCard,
    HelpCircle, Mail, Phone, Camera, Save, Eye, EyeOff,
    CheckCircle2, Clock3, Smartphone, Wallet, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+233 50 123 4567',
        bio: 'Shop manager with 5 years of experience in auto repair industry.'
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        newReviews: true,
        workerUpdates: true,
        weeklyReports: true
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const billingPlans = [
        {
            id: 'basic_monthly',
            name: 'Basic',
            amount: 99,
            currency: 'GHS',
            durationLabel: '30 days access',
            description: 'For smaller repair shops getting started with CareConnect.',
            features: ['1 shop profile', 'Worker visibility', 'Ratings overview']
        },
        {
            id: 'pro_monthly',
            name: 'Pro',
            amount: 199,
            currency: 'GHS',
            durationLabel: '30 days access',
            description: 'For growing teams that want more visibility and control.',
            features: ['Everything in Basic', 'Priority support', 'Advanced team tracking']
        }
    ];

    const mobileMoneyProviders = [
        { id: 'mtn', label: 'MTN MoMo' },
        { id: 'atl', label: 'AirtelTigo Money' },
        { id: 'vod', label: 'Telecel Cash' }
    ];

    const [billingState, setBillingState] = useState({
        selectedPlanId: billingPlans[0].id,
        billingEmail: profile.email,
        phone: profile.phone,
        provider: mobileMoneyProviders[0].id,
        currentPlan: 'Trial',
        subscriptionStatus: 'inactive',
        renewalDate: 'Not active',
        paymentStatus: 'idle',
        reference: '',
        message: ''
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingState(prev => ({ ...prev, [name]: value }));
    };

    const handlePlanSelect = (planId) => {
        setBillingState(prev => ({ ...prev, selectedPlanId: planId }));
    };

    const handleMobileMoneyPayment = () => {
        const selectedPlan = billingPlans.find(plan => plan.id === billingState.selectedPlanId);
        const reference = `CC-GH-${Date.now().toString().slice(-8)}`;

        setBillingState(prev => ({
            ...prev,
            currentPlan: selectedPlan.name,
            subscriptionStatus: 'pending',
            paymentStatus: 'pending',
            renewalDate: 'Awaiting confirmation',
            reference,
            message: `Approve the ${selectedPlan.currency} ${selectedPlan.amount.toFixed(2)} ${selectedPlan.name} payment on your phone to complete activation.`
        }));
    };

    const selectedBillingPlan = billingPlans.find(plan => plan.id === billingState.selectedPlanId);
    const selectedProvider = mobileMoneyProviders.find(provider => provider.id === billingState.provider);

    const settingsSections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];

    const ProfileSection = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>

            {/* Profile Picture */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#294F7B] to-[#1d3855] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {profile.firstName[0]}{profile.lastName[0]}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#294F7B] rounded-full flex items-center justify-center text-white hover:bg-[#1d3855] transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">JPG, PNG or GIF. Max size 5MB</p>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                            Upload Photo
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleProfileChange}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none resize-none"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#294F7B] text-white font-semibold rounded-lg hover:bg-[#1d3855] transition-all">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    const NotificationsSection = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Settings</h2>
                <p className="text-gray-600">Choose how you want to receive notifications</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                    {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleNotificationChange(item.key)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-[#294F7B]' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Types</h3>
                <div className="space-y-4">
                    {[
                        { key: 'newReviews', label: 'New Reviews', desc: 'Get notified when customers leave reviews' },
                        { key: 'workerUpdates', label: 'Worker Updates', desc: 'Updates about your workers performance' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly performance summaries' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleNotificationChange(item.key)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-[#294F7B]' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const SecuritySection = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Security Settings</h2>
                <p className="text-gray-600">Manage your password and account security</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#294F7B] text-white font-semibold rounded-lg hover:bg-[#1d3855] transition-all">
                        <Lock className="w-5 h-5" />
                        Update Password
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-700">Add an extra layer of security to your account</p>
                        <p className="text-sm text-gray-500 mt-1">Currently disabled</p>
                    </div>
                    <button className="px-4 py-2 border border-[#294F7B] text-[#294F7B] font-medium rounded-lg hover:bg-blue-50 transition-colors">
                        Enable 2FA
                    </button>
                </div>
            </div>
        </div>
    );

    const BillingSection = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Billing & Subscription</h2>
                <p className="text-gray-600">Manage your Ghana mobile money subscription in Ghana cedis.</p>
            </div>

            <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#294F7B] text-sm font-medium mb-4">
                                    <Wallet className="w-4 h-4" />
                                    Ghana Mobile Money
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">Current Subscription</h3>
                                <p className="text-gray-600">Billing stays aligned with your current account setup and uses Ghana-first providers only.</p>
                            </div>
                            <div className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${billingState.subscriptionStatus === 'active'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : billingState.subscriptionStatus === 'pending'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                {billingState.subscriptionStatus}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 mt-6">
                            <div className="rounded-xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-500 mb-1">Plan</p>
                                <p className="font-semibold text-gray-900">{billingState.currentPlan}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-500 mb-1">Renewal</p>
                                <p className="font-semibold text-gray-900">{billingState.renewalDate}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-500 mb-1">Currency</p>
                                <p className="font-semibold text-gray-900">Ghana Cedis (GHS)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-[#294F7B]" />
                            <h3 className="font-semibold text-gray-900">Choose a Plan</h3>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-4">
                            {billingPlans.map((plan) => {
                                const isSelected = plan.id === billingState.selectedPlanId;

                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => handlePlanSelect(plan.id)}
                                        className={`text-left rounded-xl border p-5 transition-all ${isSelected
                                                ? 'border-[#294F7B] bg-blue-50/60 shadow-sm'
                                                : 'border-gray-200 hover:border-[#294F7B]/40 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">{plan.name}</p>
                                                <p className="text-sm text-gray-500">{plan.durationLabel}</p>
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-[#294F7B]" />}
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            GHS {plan.amount.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                                        <div className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Smartphone className="w-5 h-5 text-[#294F7B]" />
                            <h3 className="font-semibold text-gray-900">Mobile Money Payment</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="billingEmail"
                                        value={billingState.billingEmail}
                                        onChange={handleBillingChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                                        placeholder="billing@shop.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={billingState.phone}
                                        onChange={handleBillingChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                                        placeholder="+233 55 000 0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                                <select
                                    name="provider"
                                    value={billingState.provider}
                                    onChange={handleBillingChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none bg-white"
                                >
                                    {mobileMoneyProviders.map((provider) => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                                    GHS {selectedBillingPlan.amount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-900">{selectedProvider.label}</span> will receive the payment prompt for your selected plan.
                            </div>
                            <button
                                type="button"
                                onClick={handleMobileMoneyPayment}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#294F7B] text-white font-semibold rounded-lg hover:bg-[#1d3855] transition-all"
                            >
                                <Smartphone className="w-5 h-5" />
                                Pay GHS {selectedBillingPlan.amount.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-medium text-gray-900">{selectedBillingPlan.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Provider</span>
                                <span className="font-medium text-gray-900">{selectedProvider.label}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Billing cycle</span>
                                <span className="font-medium text-gray-900">{selectedBillingPlan.durationLabel}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-gray-900 font-semibold">Total</span>
                                <span className="text-2xl font-bold text-[#294F7B]">GHS {selectedBillingPlan.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock3 className="w-5 h-5 text-[#294F7B]" />
                            <h3 className="font-semibold text-gray-900">Payment Status</h3>
                        </div>

                        {billingState.paymentStatus === 'idle' && (
                            <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-600">
                                Select a plan, confirm your provider, and start the charge. Your approval prompt will arrive on your phone.
                            </div>
                        )}

                        {billingState.paymentStatus === 'pending' && (
                            <div className="space-y-4">
                                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-900">Approve this payment on your phone</p>
                                            <p className="text-sm text-amber-800 mt-1">{billingState.message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-gray-200 p-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Reference</span>
                                        <span className="font-medium text-gray-900">{billingState.reference}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Provider</span>
                                        <span className="font-medium text-gray-900">{selectedProvider.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="font-medium text-gray-900">{billingState.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const PlaceholderSection = ({ title }) => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">This section is coming soon</p>
            </div>
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    We're working on this feature. Check back later for updates!
                </p>
            </div>
        </div>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'notifications':
                return <NotificationsSection />;
            case 'security':
                return <SecuritySection />;
            case 'billing':
                return <BillingSection />;
            case 'help':
                return <PlaceholderSection title="Help & Support" />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <Sidebar>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="mb-6 -mx-2">
                <div className="flex overflow-x-auto gap-2 pb-2 px-2">
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeSection === section.id
                                ? 'bg-[#294F7B] text-white'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <section.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{section.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings Content */}
            <div>
                {renderSection()}
            </div>
        </Sidebar>
    );
};

export default Settings;
