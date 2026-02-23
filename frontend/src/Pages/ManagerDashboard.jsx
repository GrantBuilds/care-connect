import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Star, Plus, MapPin, Phone, Mail, Upload,
  Bell, MessageSquare, TrendingUp, Clock, ChevronRight, CheckCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegisterShop, setShowRegisterShop] = useState(false);

  // Load hasShop state from localStorage on mount
  const [hasShop, setHasShop] = useState(() => {
    const saved = localStorage.getItem('careconnect_hasShop');
    return saved === 'true';
  });

  // Load shop data from localStorage
  const [shopData, setShopData] = useState(() => {
    const saved = localStorage.getItem('careconnect_shopData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      shopName: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      description: '',
      services: []
    };
  });

  // Sample notifications data
  const notifications = [
    { id: 1, type: 'review', message: 'New 5-star review from John Doe for Kwame Mensah', time: '5 min ago', unread: true },
    { id: 2, type: 'worker', message: 'Ama Owusu completed 10 jobs this week', time: '1 hour ago', unread: true },
    { id: 3, type: 'review', message: 'New 4-star review from Sarah Johnson', time: '3 hours ago', unread: false },
    { id: 4, type: 'system', message: 'Your shop profile is 80% complete', time: '1 day ago', unread: false },
  ];

  // Sample recent reviews
  const recentReviews = [
    { id: 1, customer: 'John Doe', worker: 'Kwame Mensah', rating: 5, comment: 'Excellent service! Very professional.', date: 'Today' },
    { id: 2, customer: 'Jane Smith', worker: 'Ama Owusu', rating: 4, comment: 'Good work, will come back again.', date: 'Yesterday' },
    { id: 3, customer: 'Michael Brown', worker: 'Kofi Asante', rating: 5, comment: 'Best paint job in town!', date: '2 days ago' },
  ];

  // Sample top workers
  const topWorkers = [
    { id: 1, name: 'Kofi Asante', role: 'Paint Specialist', rating: 4.9, reviews: 52, avatar: 'KA' },
    { id: 2, name: 'Kwame Mensah', role: 'Senior Mechanic', rating: 4.8, reviews: 45, avatar: 'KM' },
    { id: 3, name: 'Ama Owusu', role: 'Electrician', rating: 4.6, reviews: 38, avatar: 'AO' },
  ];

  const handleShopInputChange = (e) => {
    const { name, value } = e.target;
    setShopData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterShop = () => {
    console.log('Registering shop:', shopData);
    // Save to localStorage
    localStorage.setItem('careconnect_hasShop', 'true');
    localStorage.setItem('careconnect_shopData', JSON.stringify(shopData));
    setHasShop(true);
    setShowRegisterShop(false);
    setActiveTab('overview');
  };

  const RegisterShopForm = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Your Shop</h2>
          <p className="text-gray-600">Fill in the details to get your shop up and running on CareConnect</p>
        </div>

        <div className="space-y-6">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shop Name *
            </label>
            <input
              type="text"
              name="shopName"
              value={shopData.shopName}
              onChange={handleShopInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
              placeholder="e.g., AutoCare Plus"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={shopData.address}
                onChange={handleShopInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                placeholder="Street address"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={shopData.city}
              onChange={handleShopInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
              placeholder="e.g., Accra"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={shopData.phone}
                  onChange={handleShopInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                  placeholder="+233 50 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={shopData.email}
                  onChange={handleShopInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none"
                  placeholder="shop@example.com"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              name="description"
              value={shopData.description}
              onChange={handleShopInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294F7B] focus:border-transparent outline-none resize-none"
              placeholder="Tell customers about your shop, services, and expertise..."
            />
          </div>

          {/* Shop Logo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shop Logo (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#294F7B] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleRegisterShop}
              className="flex-1 px-6 py-3 bg-[#294F7B] text-white font-semibold rounded-lg hover:bg-[#1d3855] transition-all"
            >
              Register Shop
            </button>
            <button
              onClick={() => setShowRegisterShop(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NoShopView = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-[#294F7B]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to CareConnect!</h2>
        <p className="text-gray-600 mb-2 max-w-md mx-auto">
          Get started by registering your shop.
        </p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Once registered, you can add workers, manage ratings, and track performance.
        </p>
        <button
          onClick={() => setShowRegisterShop(true)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#294F7B] text-white font-semibold rounded-lg hover:bg-[#1d3855] shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Register Shop
        </button>
      </div>
    </div>
  );

  const OverviewContent = () => {
    if (!hasShop) return <NoShopView />;

    const displayShopName = shopData.shopName || 'Your Shop';
    const displayCity = shopData.city || 'Location';
    const displayPhone = shopData.phone || 'Phone';

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#294F7B] to-[#1d3855] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
              <p className="text-blue-100">Here's what's happening with your shop today.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Bell className="w-5 h-5" />
              <span className="font-medium">{notifications.filter(n => n.unread).length} new notifications</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">24</h3>
                <p className="text-xs text-gray-600">Total Workers</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+3 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">4.6</h3>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+0.2 from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">342</h3>
                <p className="text-xs text-gray-600">Total Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+28 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">156</h3>
                <p className="text-xs text-gray-600">Jobs Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+12 this week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
              <button className="text-sm text-[#294F7B] font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'worker' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                    {notification.type === 'review' ? <Star className="w-5 h-5" /> :
                      notification.type === 'worker' ? <Users className="w-5 h-5" /> :
                        <Bell className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Workers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Top Workers</h2>
              <button
                onClick={() => navigate('/workers')}
                className="text-sm text-[#294F7B] font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {topWorkers.map((worker, index) => (
                <div key={worker.id} className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#294F7B] to-[#1d3855] rounded-full flex items-center justify-center text-white font-bold">
                      {worker.avatar}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{worker.name}</p>
                    <p className="text-xs text-gray-600">{worker.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{worker.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{worker.reviews} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Reviews</h2>
            <button
              onClick={() => navigate('/ratings')}
              className="text-sm text-[#294F7B] font-medium hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{review.customer}</p>
                    <p className="text-xs text-gray-500">for {review.worker}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Shop</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#294F7B] to-[#1d3855] rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{displayShopName}</h3>
              <p className="text-gray-600 mb-4">{shopData.description || 'Professional auto repair and maintenance services'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{shopData.address ? `${shopData.address}, ${displayCity}` : 'East Legon, Accra'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{displayPhone}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Edit Shop
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showRegisterShop) return <RegisterShopForm />;
    return <OverviewContent />;
  };

  return (
    <Sidebar>
      {!showRegisterShop && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your shop and workers</p>
        </div>
      )}
      {renderContent()}
    </Sidebar>
  );
};

export default ManagerDashboard;