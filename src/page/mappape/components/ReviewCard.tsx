// // components/ReviewCard.tsx - Updated
// import React from "react";
// import { Star, Edit2, Trash2 } from "lucide-react";
// import ImageGallery from "./ImageGallery";

// interface ReviewCardProps {
//   review: {
//     id: string;
//     userName: string;
//     avatar: string;
//     rating: number;
//     date: string;
//     comment: string;
//     images?: string[];
//     isCurrentUser?: boolean;
//   };
//   onEdit?: () => void;
//   onDelete?: () => void;
// }

// const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-3">
//         <img
//           src={review.avatar}
//           alt={review.userName}
//           className="w-10 h-10 rounded-full flex-shrink-0"
//         />

//         <div className="flex-1 min-w-0">
//           {/* Header */}
//           <div className="flex items-center justify-between gap-2 mb-1">
//             <div className="flex items-center gap-2 min-w-0">
//               <h4 className="font-semibold text-gray-800 truncate">
//                 {review.userName}
//               </h4>
//               {review.isCurrentUser && (
//                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
//                   Bạn
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <span className="text-xs text-gray-500">{review.date}</span>
//               {review.isCurrentUser && (onEdit || onDelete) && (
//                 <div className="flex gap-1">
//                   {onEdit && (
//                     <button
//                       onClick={onEdit}
//                       className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                   )}
//                   {onDelete && (
//                     <button
//                       onClick={onDelete}
//                       className="p-1 text-red-600 hover:bg-red-50 rounded transition"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Rating */}
//           <div className="flex items-center gap-1 mb-2">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-4 h-4 ${
//                   i < review.rating
//                     ? "text-yellow-500 fill-yellow-500"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>

//           {/* Comment */}
//           {review.comment && (
//             <p className="text-sm text-gray-700 leading-relaxed mb-2">
//               {review.comment}
//             </p>
//           )}

//           {/* Images */}
//           {review.images && review.images.length > 0 && (
//             <ImageGallery images={review.images} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewCard;