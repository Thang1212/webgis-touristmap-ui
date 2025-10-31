// components/admin/PlaceManagement.tsx
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Star, Phone, Globe, Clock, MapPinned, Image } from 'lucide-react';
import type { Place } from '../../../type/admin.types';

interface PlaceManagementProps {
  places: Place[];
  onAddPlace: () => void;
  onEditPlace: (place: Place) => void;
  onDeletePlace: (placeId: number) => void;
}

const PlaceManagement: React.FC<PlaceManagementProps> = ({ 
  places, 
  onAddPlace, 
  onEditPlace, 
  onDeletePlace 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        {/* Search and Actions */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm place..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border rounded-lg"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả Categories</option>
              <option value="tourist_attraction">Tourist Attraction</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="beach">Beach</option>
            </select>
          </div>
          <button 
            onClick={onAddPlace}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4"
          >
            <Plus className="w-4 h-4" />
            Thêm Place
          </button>
        </div>

        {/* Places Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{place.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {place.imageThumbnail ? (
                        <img 
                          src={place.imageThumbnail} 
                          alt={place.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{place.name}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {place.description || 'Chưa có mô tả'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {place.categories?.split(',').map((cat, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">{place.address || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPinned className="w-3 h-3" />
                      <div>
                        <div>Lat: {place.location.coordinates[1].toFixed(6)}</div>
                        <div>Lng: {place.location.coordinates[0].toFixed(6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{place.rating?.toFixed(1) ?? 'N/A'}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      ({place.userRatingsTotal ?? 0} reviews)
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {place.phone && (
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{place.phone}</span>
                      </div>
                    )}
                    {place.website && (
                      <div className="flex items-center gap-1 text-blue-600 mb-1">
                        <Globe className="w-3 h-3" />
                        <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {(place.open_hour || place.close_hour) && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {place.open_hour?.substring(0, 5)} - {place.close_hour?.substring(0, 5)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        className="p-1 hover:bg-green-50 rounded text-green-600"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEditPlace(place)}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeletePlace(place.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">Hiển thị 1-{places.length} trong tổng số {places.length} places</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceManagement;