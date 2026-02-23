import React, { useState } from 'react';
import {
  Users, Star, Plus, Search, Filter, X, Phone, Mail,
  MapPin, Calendar, Edit, Trash2, Eye, MessageSquare,
  ChevronDown, ChevronUp, Building2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Workers = () => {
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShop, setFilterShop] = useState('all');
  const [expandedReviews, setExpandedReviews] = useState({});

  // Sample shops data - in real app, this would come from API
  const shops = [
    { id: 1, name: 'AutoCare Plus', location: 'East Legon, Accra' },
    { id: 2, name: 'QuickFix Motors', location: 'Osu, Accra' },
    { id: 3, name: 'Elite Auto Services', location: 'Tema, Greater Accra' }
  ];

  // Sample workers data
  const [workers] = useState([
    {
      id: 1,
      name: 'Kwame Mensah',
      role: 'Senior Mechanic',
      phone: '+233 50 123 4567',
      email: 'kwame@example.com',
      joinDate: '2023-01-15',
      avatar: 'KM',
      rating: 4.8,
      totalReviews: 45,
      status: 'active',
      shop: 'AutoCare Plus',
      shopLocation: 'East Legon, Accra',
      reviews: [
        {
          id: 1,
          customerName: 'John Doe',
          rating: 5,
          comment: 'Excellent service! Very professional and fixed my car quickly.',
          date: '2024-12-10'
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          rating: 4,
          comment: 'Good work but took a bit longer than expected.',
          date: '2024-12-08'
        },
        {
          id: 3,
          customerName: 'Michael Brown',
          rating: 5,
          comment: 'Outstanding mechanic! Explained everything clearly.',
          date: '2024-12-05'
        }
      ]
    },
    {
      id: 2,
      name: 'Ama Owusu',
      role: 'Electrician',
      phone: '+233 54 987 6543',
      email: 'ama@example.com',
      joinDate: '2023-03-20',
      avatar: 'AO',
      rating: 4.6,
      totalReviews: 38,
      status: 'active',
      shop: 'QuickFix Motors',
      shopLocation: 'Osu, Accra',
      reviews: [
        {
          id: 4,
          customerName: 'Sarah Johnson',
          rating: 5,
          comment: 'Fixed my electrical issues perfectly!',
          date: '2024-12-11'
        },
        {
          id: 5,
          customerName: 'David Lee',
          rating: 4,
          comment: 'Professional and knowledgeable.',
          date: '2024-12-09'
        }
      ]
    },
    {
      id: 3,
      name: 'Kofi Asante',
      role: 'Paint Specialist',
      phone: '+233 55 456 7890',
      email: 'kofi@example.com',
      joinDate: '2023-06-10',
      avatar: 'KA',
      rating: 4.9,
      totalReviews: 52,
      status: 'active',
      shop: 'AutoCare Plus',
      shopLocation: 'East Legon, Accra',
      reviews: [
        {
          id: 6,
          customerName: 'Emily White',
          rating: 5,
          comment: 'Amazing paint job! Car looks brand new.',
          date: '2024-12-12'
        },
        {
          id: 7,
          customerName: 'Robert Taylor',
          rating: 5,
          comment: 'Best painter in town! Highly recommend.',
          date: '2024-12-10'
        },
        {
          id: 8,
          customerName: 'Lisa Anderson',
          rating: 4,
          comment: 'Great attention to detail.',
          date: '2024-12-07'
        }
      ]
    }
  ]);

  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    shopId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddWorker = () => {
    console.log('Adding worker:', newWorker);
    setShowAddWorker(false);
    setNewWorker({
      name: '',
      role: '',
      phone: '',
      email: '',
      shopId: ''
    });
    // API call would go here
  };

  const toggleReviews = (workerId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [workerId]: !prev[workerId]
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShop = filterShop === 'all' || worker.shop === filterShop;
    return matchesSearch && matchesShop;
  });

  const AddWorkerModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Worker</h2>
          <button
            onClick={() => setShowAddWorker(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Shop Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Shop *
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="shopId"
                value={newWorker.shopId}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose a shop</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={newWorker.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Kwame Mensah"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role/Position *
            </label>
            <input
              type="text"
              name="role"
              value={newWorker.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Senior Mechanic"
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
                  value={newWorker.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+233 50 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={newWorker.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="worker@example.com"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddWorker}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Add Worker
            </button>
            <button
              onClick={() => setShowAddWorker(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkerDetailsModal = () => {
    if (!selectedWorker) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Worker Details</h2>
            <button
              onClick={() => setSelectedWorker(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Worker Info */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedWorker.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedWorker.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{selectedWorker.role}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{selectedWorker.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{selectedWorker.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(selectedWorker.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedWorker.rating}</span>
                    <span className="text-gray-600">({selectedWorker.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Customer Reviews ({selectedWorker.reviews.length})
              </h3>
              <div className="space-y-4">
                {selectedWorker.reviews.map(review => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.customerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">{review.rating}.0</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sidebar>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workers Management</h1>
        <p className="text-gray-600">Manage your team and track their performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{workers.length}</h3>
          </div>
          <p className="text-sm text-gray-600">Total Workers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{shops.length}</h3>
          </div>
          <p className="text-sm text-gray-600">Total Shops</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">135</h3>
          </div>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Shop Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterShop}
                onChange={(e) => setFilterShop(e.target.value)}
                className="pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Shops</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.name}>{shop.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Worker Button */}
          <button
            onClick={() => setShowAddWorker(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <React.Fragment key={worker.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    {/* Worker Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {worker.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{worker.name}</p>
                          <p className="text-sm text-gray-600">{worker.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Shop Info */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{worker.shop}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{worker.shopLocation}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{worker.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{worker.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">{worker.rating}</span>
                      </div>
                    </td>

                    {/* Reviews */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleReviews(worker.id)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{worker.totalReviews} reviews</span>
                        {expandedReviews[worker.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWorker(worker)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Reviews Section */}
                  {expandedReviews[worker.id] && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Customer Reviews</h4>
                          {worker.reviews.map((review) => (
                            <div
                              key={review.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {review.customerName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating)}
                                    <span className="text-sm text-gray-600">
                                      {review.rating}.0
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No workers found</p>
            <p className="text-sm text-gray-500">
              {searchQuery || filterShop !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first worker to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddWorker && <AddWorkerModal />}
      {selectedWorker && <WorkerDetailsModal />}
    </Sidebar>
  );
};

export default Workers;