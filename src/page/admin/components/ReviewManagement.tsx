// // components/admin/ReviewManagement.tsx
// import React, { useState } from 'react';
// import { Search, Trash2, Star, User, MapPin, Image as ImageIcon } from 'lucide-react';

// interface Review {
//   id: string;
//   userName: string;
//   userAvatar?: string;
//   placeName: string;
//   rating: number;
//   comment: string;
//   images?: string[];
//   createdAt: string;
// }

// interface ReviewManagementProps {
//   onDeleteReview: (reviewId: string) => void;
// }

// const ReviewManagement: React.FC<ReviewManagementProps> = ({
//   onDeleteReview
// }) => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [ratingFilter, setRatingFilter] = useState<string>('');

//   // Mock data với images
//   const reviews: Review[] = [
//     {
//       id: '1',
//       userName: 'Nguyễn Văn A',
//       userAvatar: 'https://i.pravatar.cc/150?img=1',
//       placeName: 'Bãi biển Mũi Né',
//       rating: 5,
//       comment: 'Bãi biển rất đẹp, sạch sẽ, phù hợp để nghỉ dưỡng',
//       images: [
//         'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
//         'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
//         'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400'
//       ],
//       createdAt: '2024-11-01'
//     },
//     {
//       id: '2',
//       userName: 'Trần Thị B',
//       placeName: 'Chú Dư đồ cổ',
//       rating: 4,
//       comment: 'Địa điểm thú vị, có nhiều đồ cổ độc đáo',
//       images: [
//         'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400'
//       ],
//       createdAt: '2024-10-28'
//     },
//     {
//       id: '3',
//       userName: 'Lê Văn C',
//       placeName: 'Bãi biển Mũi Né',
//       rating: 3,
//       comment: 'Tạm ổn, nhưng đông người quá',
//       images: [],
//       createdAt: '2024-10-25'
//     },
//     {
//       id: '4',
//       userName: 'Phạm Thị D',
//       placeName: 'Khách sạn Sunrise',
//       rating: 5,
//       comment: 'Khách sạn rất tuyệt vời, phòng ốc sạch sẽ, view đẹp. Nhân viên thân thiện và phục vụ chu đáo.',
//       images: [
//         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
//         'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
//       ],
//       createdAt: '2024-10-20'
//     },
//   ];

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-4 h-4 ${
//               star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="bg-white rounded-lg shadow">
//         {/* Header */}
//         <div className="p-4 border-b flex justify-between items-center">
//           <div className="flex gap-3 flex-1 max-w-2xl">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm review..."
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <select 
//               className="px-4 py-2 border rounded-lg"
//               value={ratingFilter}
//               onChange={(e) => setRatingFilter(e.target.value)}
//             >
//               <option value="">Tất cả Rating</option>
//               <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
//               <option value="4">⭐⭐⭐⭐ 4 sao</option>
//               <option value="3">⭐⭐⭐ 3 sao</option>
//               <option value="2">⭐⭐ 2 sao</option>
//               <option value="1">⭐ 1 sao</option>
//             </select>
//           </div>
//         </div>

//         {/* Reviews Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Place</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment & Images</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {reviews.map((review) => (
//                 <tr key={review.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       {review.userAvatar ? (
//                         <img 
//                           src={review.userAvatar} 
//                           alt={review.userName}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                           <User className="w-5 h-5 text-blue-600" />
//                         </div>
//                       )}
//                       <div className="font-medium text-gray-900">{review.userName}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-gray-400" />
//                       <span className="text-sm text-gray-900">{review.placeName}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {renderStars(review.rating)}
//                     <div className="text-xs text-gray-500 mt-1">{review.rating}/5</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="max-w-md">
//                       <p className="text-sm text-gray-700 line-clamp-2 mb-2">
//                         {review.comment}
//                       </p>
//                       {review.images && review.images.length > 0 && (
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <ImageIcon className="w-3 h-3" />
//                             <span>{review.images.length} ảnh</span>
//                           </div>
//                           <div className="flex gap-2">
//                             {review.images.slice(0, 3).map((img, idx) => (
//                               <img 
//                                 key={idx}
//                                 src={img} 
//                                 alt={`Review ${idx + 1}`}
//                                 className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-75"
//                                 onClick={() => window.open(img, '_blank')}
//                               />
//                             ))}
//                             {review.images.length > 3 && (
//                               <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">
//                                 +{review.images.length - 3}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(review.createdAt).toLocaleDateString('vi-VN')}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button 
//                       onClick={() => {
//                         if (confirm('Bạn có chắc muốn xóa review này?')) {
//                           onDeleteReview(review.id);
//                         }
//                       }}
//                       className="p-1 hover:bg-red-50 rounded text-red-600"
//                       title="Xóa"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="px-6 py-4 border-t flex justify-between items-center">
//           <p className="text-sm text-gray-500">
//             Hiển thị 1-{reviews.length} trong tổng số {reviews.length} reviews
//           </p>
//           <div className="flex gap-2">
//             <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
//               Trước
//             </button>
//             <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
//             <button className="px-3 py-1 border rounded hover:bg-gray-50">
//               Sau
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewManagement;
// components/admin/ReviewManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Star, 
  User, 
  MapPin, 
  Image as ImageIcon, 
  Calendar, 
  Filter, 
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Place {
  id: number;
  name: string;
  address: string;
  imageThumbnail?: string;
}

interface Review {
  id: string;
  user_id: string;
  place_id: number;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
  place: Place;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  limit: number;
}

interface ReviewManagementProps {
  onDeleteReview?: (reviewId: string) => void;
}

const ReviewManagement: React.FC<ReviewManagementProps> = ({
  onDeleteReview
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter states
  const [keyword, setKeyword] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Debounce search
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Image preview modal
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      // Reset to page 1 when search changes
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [pagination.currentPage, debouncedKeyword, ratingFilter, startDate, endDate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine which endpoint to use
      const hasFilters = debouncedKeyword || ratingFilter || startDate || endDate;
      const endpoint = hasFilters ? '/api/admin/reviews/search' : '/api/admin/reviews';

      const params: any = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      if (hasFilters) {
        if (debouncedKeyword) params.keyword = debouncedKeyword;
        if (ratingFilter) params.rating = ratingFilter;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }

      const response = await axios.get(endpoint, {
        params
      });

      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi tải reviews';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa review này?')) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Xóa review thành công!');
      
      // Refresh data
      fetchReviews();
      
      // Call parent callback if provided
      if (onDeleteReview) {
        onDeleteReview(reviewId);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi xóa review';
      toast.error(errorMsg);
      console.error('Error deleting review:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setRatingFilter('');
    setStartDate('');
    setEndDate('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleImageClick = (images: string[], index: number) => {
    setPreviewImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const hasActiveFilters = keyword || ratingFilter || startDate || endDate;

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        {/* Header with Filters */}
        <div className="p-4 border-b space-y-3">
          {/* Main Search Row */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên user, địa điểm, comment..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Tất cả Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
              <option value="4">⭐⭐⭐⭐ 4 sao</option>
              <option value="3">⭐⭐⭐ 3 sao</option>
              <option value="2">⭐⭐ 2 sao</option>
              <option value="1">⭐ 1 sao</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                showAdvancedFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-red-300 rounded-lg flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="flex gap-3 flex-wrap pt-3 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  placeholder="Từ ngày"
                />
                <span className="text-gray-500">đến</span>
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  placeholder="Đến ngày"
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {keyword && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  Từ khóa: "{keyword}"
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setKeyword('')}
                  />
                </span>
              )}
              {ratingFilter && (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                  Rating: {ratingFilter} sao
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setRatingFilter('')}
                  />
                </span>
              )}
              {startDate && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1">
                  Từ: {new Date(startDate).toLocaleDateString('vi-VN')}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setStartDate('')}
                  />
                </span>
              )}
              {endDate && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1">
                  Đến: {new Date(endDate).toLocaleDateString('vi-VN')}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setEndDate('')}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && reviews.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Không tìm thấy review nào</p>
            {hasActiveFilters && (
              <p className="text-sm mt-2">Thử điều chỉnh bộ lọc của bạn</p>
            )}
          </div>
        )}

        {/* Reviews Table */}
        {!loading && !error && reviews.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa điểm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bình luận & Ảnh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.user.avatar ? (
                            <img 
                              src={review.user.avatar} 
                              alt={review.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{review.user.name}</div>
                            <div className="text-xs text-gray-500">{review.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.place.name}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{review.place.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                        <div className="text-xs text-gray-500 mt-1">{review.rating}/5</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          {review.comment && (
                            <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                              {review.comment}
                            </p>
                          )}
                          {review.images && review.images.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <ImageIcon className="w-3 h-3" />
                                <span>{review.images.length} ảnh</span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {review.images.slice(0, 3).map((img, idx) => (
                                  <img 
                                    key={idx}
                                    src={img} 
                                    alt={`Review ${idx + 1}`}
                                    className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                    onClick={() => handleImageClick(review.images, idx)}
                                  />
                                ))}
                                {review.images.length > 3 && (
                                  <div 
                                    className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600 cursor-pointer hover:bg-gray-300"
                                    onClick={() => handleImageClick(review.images, 3)}
                                  >
                                    +{review.images.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors"
                          title="Xóa review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1}-
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalReviews)} trong tổng số {pagination.totalReviews} reviews
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded ${
                          pagination.currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Preview Modal */}
      {showImageModal && previewImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <img 
              src={previewImages[currentImageIndex]} 
              alt={`Preview ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {previewImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? previewImages.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === previewImages.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {previewImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;