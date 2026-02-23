import React, { useState } from 'react';
import {
  Star, Search, Filter, X, Calendar, Eye, User, MessageSquare,
  Image as ImageIcon, ThumbsUp, TrendingUp, Award
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Ratings = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterWorker, setFilterWorker] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all'); // today, week, month, all
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample ratings data - ONLY 2 DUMMY ENTRIES
  const [ratings] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      customerPhone: '+233 50 111 2222',
      workerName: 'Kwame Mensah',
      workerRole: 'Senior Mechanic',
      workerAvatar: 'KM',
      shop: 'AutoCare Plus',
      shopLocation: 'East Legon, Accra',
      rating: 5,
      comment: 'Excellent service! Very professional and fixed my car quickly.',
      date: '2024-12-19',
      serviceType: 'Brake Repair',
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', caption: 'Before repair' },
        { id: 2, url: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400', caption: 'After repair' }
      ],
      helpful: 12
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      customerPhone: '+233 54 222 3333',
      workerName: 'Ama Owusu',
      workerRole: 'Electrician',
      workerAvatar: 'AO',
      shop: 'QuickFix Motors',
      shopLocation: 'Osu, Accra',
      rating: 4,
      comment: 'Good work but took a bit longer than expected. Overall satisfied with the service.',
      date: '2024-12-18',
      serviceType: 'Electrical System Repair',
      images: [
        { id: 3, url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400', caption: 'Fixed wiring' }
      ],
      helpful: 8
    }
  ]);

  // Get unique workers for filter
  const workers = [...new Set(ratings.map(r => r.workerName))];

  // Filter by time period
  const filterByPeriod = (rating) => {
    const ratingDate = new Date(rating.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterPeriod) {
      case 'today':
        return ratingDate >= today;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return ratingDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return ratingDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch =
      rating.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = filterRating === 'all' || rating.rating === parseInt(filterRating);
    const matchesWorker = filterWorker === 'all' || rating.workerName === filterWorker;
    const matchesPeriod = filterByPeriod(rating);

    return matchesSearch && matchesRating && matchesWorker && matchesPeriod;
  });

  // Calculate statistics
  const avgRating = filteredRatings.length > 0
    ? (filteredRatings.reduce((sum, r) => sum + r.rating, 0) / filteredRatings.length).toFixed(1)
    : 0;

  const totalRatings = filteredRatings.length;

  const ratingDistribution = {
    5: filteredRatings.filter(r => r.rating === 5).length,
    4: filteredRatings.filter(r => r.rating === 4).length,
    3: filteredRatings.filter(r => r.rating === 3).length,
    2: filteredRatings.filter(r => r.rating === 2).length,
    1: filteredRatings.filter(r => r.rating === 1).length,
  };

  // Find highest rated today
  const todayRatings = ratings.filter(r => {
    const ratingDate = new Date(r.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return ratingDate >= today;
  });

  const highestToday = todayRatings.length > 0
    ? todayRatings.reduce((max, r) => r.rating > max.rating ? r : max, todayRatings[0])
    : null;

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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-blue-600 bg-blue-50';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Average';
    if (rating === 2) return 'Poor';
    return 'Very Poor';
  };

  const ImageGalleryModal = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-5xl w-full">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage.url}
            alt={selectedImage.caption}
            className="w-full h-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.caption && (
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">{selectedImage.caption}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RatingDetailsModal = () => {
    if (!selectedRating) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Rating Details</h2>
            <button
              onClick={() => setSelectedRating(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Rating Overview */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${getRatingColor(selectedRating.rating)}`}>
                {selectedRating.rating}.0
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {renderStars(selectedRating.rating)}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {getRatingLabel(selectedRating.rating)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {new Date(selectedRating.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  Service: <span className="font-semibold text-gray-900">{selectedRating.serviceType}</span>
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{selectedRating.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{selectedRating.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Worker Info */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Worker Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedRating.workerAvatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">{selectedRating.workerName}</p>
                  <p className="text-gray-600">{selectedRating.workerRole}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRating.shop} - {selectedRating.shopLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Customer Feedback
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">{selectedRating.comment}</p>
              </div>
            </div>

            {/* Images */}
            {selectedRating.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Proof Images ({selectedRating.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRating.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-all"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {image.caption && (
                        <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Helpfulness */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Was this review helpful?</span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-medium">{selectedRating.helpful}</span>
                </button>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ratings & Reviews</h1>
        <p className="text-gray-600">Monitor customer feedback and worker performance</p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Average Rating Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{avgRating}</h3>
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-xs text-gray-500 mt-1">From {totalRatings} reviews</p>
        </div>

        {/* Total Reviews Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalRatings}</h3>
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Period Filter */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {filteredRatings.map((rating) => (
          <div
            key={rating.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Worker Info */}
              <div className="flex items-start gap-4 lg:w-64 flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {rating.workerAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-lg truncate">{rating.workerName}</p>
                  <p className="text-sm text-gray-600 truncate">{rating.workerRole}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{rating.shop}</p>
                </div>
              </div>

              {/* Rating & Review */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  {renderStars(rating.rating)}
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(rating.rating)}`}>
                    {rating.rating}.0 • {getRatingLabel(rating.rating)}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{rating.comment}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{rating.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(rating.date).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-xs">
                    {rating.serviceType}
                  </span>
                </div>

                {/* Images Preview */}
                {rating.images.length > 0 && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <div className="flex gap-2">
                      {rating.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.caption}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col items-center lg:items-end gap-3">
                <button
                  onClick={() => setSelectedRating(rating)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold">{rating.helpful}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredRatings.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No ratings found</h3>
            <p className="text-gray-600">
              {searchQuery || filterRating !== 'all' || filterPeriod !== 'all'
                ? 'Try adjusting your filters'
                : 'No ratings available yet'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedRating && <RatingDetailsModal />}
      {selectedImage && <ImageGalleryModal />}
    </Sidebar>
  );
};

export default Ratings;