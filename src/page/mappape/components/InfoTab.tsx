// components/InfoTab.tsx
import React from "react";
import { MapPin, Star, Phone, Globe, Clock, Tag, Calendar, Users } from "lucide-react";
import type { Place, Category } from "../../../store/mapstore"; // ✅ Import Category

interface InfoTabProps {
  place: Place;
}

const InfoTab: React.FC<InfoTabProps> = ({ place }) => {
  // Format giờ mở cửa
  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.substring(0, 5); // Lấy HH:mm từ HH:mm:ss
  };

  const getOpeningHours = () => {
    const open = formatTime(place.open_hour);
    const close = formatTime(place.close_hour);
    console.log(open, close);
    // Kiểm tra nếu mở cửa 24/7
    if ((open === "00:00" && close === "23:59") || (!place.open_hour || !place.close_hour)) {
      return "Mở cửa 24/7";
    }
    
    return `${open} - ${close}`;
  };

  // ✅ FIXED: Lấy danh sách categories từ array
  const getCategoriesList = (): Category[] => {
    if (!place.categories || place.categories.length === 0) return [];
    return place.categories;
  };

  // Format website URL
  const formatWebsiteUrl = (website?: string) => {
    if (!website) return null;
    // Thêm https:// nếu chưa có protocol
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      return `https://${website}`;
    }
    return website;
  };

  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tính rating percentage cho progress bar
  const getRatingPercentage = (rating?: number) => {
    if (!rating) return 0;
    return (rating / 5) * 100;
  };

  // Lấy màu dựa trên rating
  const getRatingColor = (rating?: number) => {
    if (!rating) return 'gray';
    if (rating >= 4.5) return 'green';
    if (rating >= 3.5) return 'blue';
    if (rating >= 2.5) return 'yellow';
    return 'red';
  };

  return (
    <>
      {/* Mô tả */}
      {place.description && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Giới thiệu</h3>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{place.description}</p>
        </div>
      )}

      {/* Categories/Tags */}
      {place.categories && place.categories.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-lg text-gray-800">Danh mục</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* ✅ FIXED: Map qua array of Category objects */}
            {getCategoriesList().map((category) => (
              <span
                key={category.id}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin liên hệ */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Thông tin liên hệ</h3>
        
        {place.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
              <p className="text-gray-800">{place.address}</p>
            </div>
          </div>
        )}

        {place.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
              <a 
                href={`tel:${place.phone}`} 
                className="text-blue-600 hover:underline font-medium"
              >
                {place.phone}
              </a>
            </div>
          </div>
        )}

        {place.website && (
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Website</p>
              <a 
                href={formatWebsiteUrl(place.website) || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline font-medium break-all"
              >
                {place.website}
              </a>
            </div>
          </div>
        )}

        {getOpeningHours() && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Giờ mở cửa</p>
              <p className="text-gray-800 font-medium">{getOpeningHours()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Đánh giá tổng quan */}
      {place.rating && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Đánh giá</h3>
          
          {/* Overall Rating */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-3xl font-bold text-gray-800">
                  {place.rating.toLocaleString()}
                </span>
                <span className="text-gray-500">/ 5.0</span>
              </div>
              {place.userRatingsTotal && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {place.userRatingsTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">đánh giá</p>
                </div>
              )}
            </div>
            
            {/* Rating Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all ${
                    place.rating >= 4.5 ? 'bg-green-500' :
                    place.rating >= 3.5 ? 'bg-blue-500' :
                    place.rating >= 2.5 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${getRatingPercentage(place.rating)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Rating Breakdown (Simulated) */}
          {/* <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 w-24">Vị trí</span>
              <div className="flex items-center gap-1 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(place.rating || 0)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {place.rating.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 w-24">Dịch vụ</span>
              <div className="flex items-center gap-1 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Math.max((place.rating || 0) - 0.2, 0))
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {Math.max((place.rating || 0) - 0.2, 0).toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 w-24">Giá cả</span>
              <div className="flex items-center gap-1 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Math.max((place.rating || 0) - 0.5, 0))
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {Math.max((place.rating || 0) - 0.5, 0).toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 w-24">Chất lượng</span>
              <div className="flex items-center gap-1 flex-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Math.min((place.rating || 0) + 0.1, 5))
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {Math.min((place.rating || 0) + 0.1, 5).toFixed(1)}
              </span>
            </div>
          </div> */}
        </div>
      )}

      {/* Thông tin bổ sung */}
      {(place.id || place.createdAt || place.updatedAt) && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Thông tin bổ sung</h3>
          <div className="space-y-2 text-sm">
            {place.id && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 min-w-[100px]">Place ID:</span>
                <span className="text-gray-700 font-mono text-xs break-all">
                  {place.id}
                </span>
              </div>
            )}
            {place.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Ngày tạo:</span>
                <span className="text-gray-700">{formatDate(place.createdAt)}</span>
              </div>
            )}
            {place.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Cập nhật:</span>
                <span className="text-gray-700">{formatDate(place.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tọa độ */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Tọa độ địa lý</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vĩ độ (Latitude):</span>
            <span className="text-sm font-mono font-semibold text-gray-800">
              {place.location.coordinates[1].toFixed(6)}°
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kinh độ (Longitude):</span>
            <span className="text-sm font-mono font-semibold text-gray-800">
              {place.location.coordinates[0].toFixed(6)}°
            </span>
          </div>
          <div className="pt-2 border-t border-gray-300">
            
            <a  href={`https://www.google.com/maps?q=${place.location.coordinates[1]},${place.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >

              <MapPin className="w-3 h-3" />
              Xem trên Google Maps
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoTab;