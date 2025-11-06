// // components/ReviewForm.tsx
// import React, { useState } from "react";
// import { Star, X } from "lucide-react";
// import ImageUpload from "./ImageUpload";

// interface ReviewFormProps {
//   onClose: () => void;
//   existingReview?: {
//     rating: number;
//     comment: string;
//     images?: string[];
//   };
// }

// const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, existingReview }) => {
//   const [rating, setRating] = useState(existingReview?.rating || 0);
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [comment, setComment] = useState(existingReview?.comment || "");
//   const [images, setImages] = useState<string[]>(existingReview?.images || []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({ rating, comment, images });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-800">
//             {existingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Rating */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Đánh giá của bạn
//             </label>
//             <div className="flex items-center gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setRating(star)}
//                   onMouseEnter={() => setHoveredRating(star)}
//                   onMouseLeave={() => setHoveredRating(0)}
//                   className="transition-transform hover:scale-110"
//                 >
//                   <Star
//                     className={`w-10 h-10 ${
//                       star <= (hoveredRating || rating)
//                         ? 'text-yellow-500 fill-yellow-500'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 </button>
//               ))}
//               {rating > 0 && (
//                 <span className="ml-2 text-lg font-semibold text-gray-700">
//                   {["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"][rating]}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Images */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Hình ảnh (Không bắt buộc)
//             </label>
//             <ImageUpload images={images} onImagesChange={setImages} />
//           </div>

//           {/* Comment */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Nhận xét (Không bắt buộc)
//             </label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Chia sẻ trải nghiệm của bạn..."
//               rows={4}
//               maxLength={1000}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//             <div className="text-xs text-gray-500 text-right mt-1">
//               {comment.length}/1000
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               disabled={rating === 0}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
//             >
//               {existingReview ? "Cập nhật" : "Gửi"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ReviewForm;

// components/ReviewForm.tsx
import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useReviews } from "../../../hooks/useReviews";

interface ReviewFormProps {
  placeId: number;
  onClose: () => void;
  onSuccess: () => void;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
    images: string[];
  };
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  placeId,
  onClose,
  onSuccess,
  existingReview,
}) => {
  const { createReview, updateReview } = useReviews(placeId);
  
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    existingReview?.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (existingReview) {
        // Update
        await updateReview(existingReview.id, {
          rating,
          comment: comment.trim() || undefined,
          existingImages,
          newImages: imageFiles,
        });
      } else {
        // Create
        await createReview({
          place_id: placeId,
          rating,
          comment: comment.trim() || undefined,
          images: imageFiles,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {existingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Đánh giá của bạn
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hình ảnh (Không bắt buộc)
            </label>
            <ImageUpload
              files={imageFiles}
              existingImages={existingImages}
              onFilesChange={setImageFiles}
              onExistingImagesChange={setExistingImages}
              maxImages={5}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhận xét (Không bắt buộc)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {comment.length}/1000 ký tự
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi...
                </>
              ) : existingReview ? (
                "Cập nhật"
              ) : (
                "Gửi đánh giá"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;