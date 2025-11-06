
import React, { useEffect, useState } from "react";
import { Star, MessageSquare, Edit2, Trash2, Loader2 } from "lucide-react";
import { useReviews } from "../../../hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ImageGallery from "./ImageGallery";
import type { Place } from "../../../type/Place";
import { useAuth } from "@/hooks/useAuth";

interface ReviewsTabProps {
  place: Place;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ place }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const {user , isAuthenticated} = useAuth()
  const {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews,
    fetchStats,
    deleteReview,
  } = useReviews(place.id);

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  const handleEdit = (review: any) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa đánh giá");
      }
    }
  };

  const handleSuccess = () => {
    fetchReviews();
    fetchStats();
  };

  const currentUserId = user?.id
const currentUserReview = Array.isArray(reviews) 
  ? reviews.find((r) => r.user_id === currentUserId)
  : undefined;
  if (isLoading && reviews.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tổng quan đánh giá */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {stats?.avgRating || 0}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(stats?.avgRating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {stats?.totalReviews || 0} đánh giá
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 w-8">{star} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách reviews */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-800">
          Đánh giá từ khách hàng
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có đánh giá nào</p>
            <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwner = review.user_id === currentUserId;
            return (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={
                      review.user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        review.user.name
                      )}&background=3b82f6&color=fff`
                    }
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {review.user.name}
                        {isOwner && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Bạn
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2">


                        <span className="text-xs text-gray-500 ">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')
                          //invalid date 
                          } 
                        </span>

                        
                        {isOwner && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(review)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {review.comment}
                      </p>
                    )}
                    {review.images && review.images.length > 0 && (
                      <ImageGallery images={review.images} />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Button viết đánh giá */}
      { isAuthenticated && (!currentUserReview ? (
        <button  
          onClick={() => {
            setEditingReview(null);
            setShowReviewForm(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          Viết đánh giá của bạn
        </button>
      ) : (
        <div className="text-center text-sm text-gray-500">
          Bạn đã đánh giá địa điểm này
        </div>
      )) }

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          placeId={place.id}
          onSuccess={handleSuccess}
          onClose={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
          existingReview={editingReview}
        />
      )}
    </div>
  );
};

export default ReviewsTab;