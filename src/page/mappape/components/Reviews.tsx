// components/ReviewsTab.tsx
import React from "react";
import { Star, MessageSquare } from "lucide-react";
import type {Place}  from "../../../type/Place";

interface ReviewsTabProps {
  place: Place;
}

interface Review {
  id: number;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ place }) => {
  // Mock reviews data
  const reviews: Review[] = [
    {
      id: 1,
      userName: "Nguyễn Văn A",
      avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff",
      rating: 5,
      date: "15/03/2024",
      comment: "Địa điểm rất đẹp, phong cảnh tuyệt vời. Nhân viên phục vụ nhiệt tình. Tôi sẽ quay lại đây lần nữa!"
    },
    {
      id: 2,
      userName: "Trần Thị B",
      avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=10b981&color=fff",
      rating: 4,
      date: "10/03/2024",
      comment: "Khá ổn, giá cả hợp lý. Tuy nhiên vào cuối tuần thì hơi đông người."
    },
    {
      id: 3,
      userName: "Lê Minh C",
      avatar: "https://ui-avatars.com/api/?name=Le+Minh+C&background=f59e0b&color=fff",
      rating: 5,
      date: "05/03/2024",
      comment: "Tuyệt vời! Không gian rộng rãi, sạch sẽ. Rất phù hợp cho gia đình."
    },
    {
      id: 4,
      userName: "Phạm Thu D",
      avatar: "https://ui-avatars.com/api/?name=Pham+Thu+D&background=8b5cf6&color=fff",
      rating: 4,
      date: "28/02/2024",
      comment: "Đẹp và yên tĩnh. Thích hợp để nghỉ ngơi, thư giãn."
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tổng quan đánh giá */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">{place?.rating}</div>
            <div className="flex items-center gap-1 mt-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < place.rating
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">{place.userRatingsTotal} đánh giá</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-6">{star}⭐</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400"
                    style={{ 
                      width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-8">
                  {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách reviews */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-800">Đánh giá từ khách hàng</h3>
        
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <img 
                src={review.avatar} 
                alt={review.userName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button viết đánh giá */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
        <MessageSquare className="w-4 h-4" />
        Viết đánh giá của bạn
      </button>
    </div>
  );
};

export default ReviewsTab;