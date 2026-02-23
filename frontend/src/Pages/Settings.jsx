import React, { useState } from 'react';
import {
    User, Bell, Lock, Palette, Globe, CreditCard,
    Shield, HelpCircle, Mail, Phone, Camera, Save, Eye, EyeOff
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
                return <PlaceholderSection title="Billing & Subscription" />;
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
