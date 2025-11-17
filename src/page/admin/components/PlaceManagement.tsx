
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Eye, Star, Phone, Globe, 
  Clock, MapPinned, Image, ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';
import type { Place } from '../../../type/admin.types';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapClickHandler from '@/page/mappape/components/MapClickHandler';
import { MAP_CONFIG } from '@/constants/map-constants';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';

interface PlaceManagementProps {
  places: Place[];
  onAddPlace: () => void;
  onEditPlace: (place: Place) => void;
  onDeletePlace: (placeId: number) => void;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Export this interface so parent can use it
export interface PlaceManagementRef {
  refresh: () => Promise<void>;
}

const PlaceManagement = forwardRef<PlaceManagementRef, PlaceManagementProps>(
  ({ places: initialPlaces, onAddPlace, onEditPlace, onDeletePlace }, ref) => {
    const [places, setPlaces] = useState<Place[]>(initialPlaces);
    const [loading, setLoading] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    // Filters
    const [searchText, setSearchText] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');

    // Pagination
    const [pagination, setPagination] = useState<PaginationInfo>({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    });

    // Categories for dropdown
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch categories
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          // const response = await axios.get('/api/places/categories');
          const response = await axios.get('/places/categories');

          setCategories(response.data.data || []);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }, []);

    // Fetch places
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: pagination.page,
          limit: pagination.limit
        };

        if (searchText) params.searchText = searchText;
        if (categoryFilter) params.categories = categoryFilter;

        // const response = await axios.get('/api/admin/places/', { params });
        const response = await axios.get('/admin/places/', { params });

        
        setPlaces(response.data.data);
        setPagination(response.data.pagination);
      } catch (error: any) {
        console.error('Error fetching places:', error);
        toast.error('Không thể tải danh sách địa điểm');
      } finally {
        setLoading(false);
      }
    };

    // Expose refresh method to parent component
    useImperativeHandle(ref, () => ({
      refresh: fetchPlaces
    }));

    // Fetch when page changes
    useEffect(() => {
      fetchPlaces();
    }, [pagination.page]);

    // Debounce search
    useEffect(() => {
      const timer = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchPlaces();
      }, 500);

      return () => clearTimeout(timer);
    }, [searchText, categoryFilter]);

    // Navigation handlers
    const handlePrevPage = () => {
      if (pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleNextPage = () => {
      if (pagination.page < pagination.totalPages) {
        setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleViewPlace = (place: Place) => {
      setSelectedPlace(place);
      const mapElement = document.getElementById('place-map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleDeleteWithRefresh = async (placeId: number) => {
      await onDeletePlace(placeId);
      await fetchPlaces();
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          {/* Search and Actions */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              
              />
            </div>
            <button 
              onClick={onAddPlace}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Thêm địa điểm
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : places.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa điểm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tọa độ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
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
                            <img referrerPolicy="no-referrer"
                              src={place.imageThumbnail} 
                              alt={place.name}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900">{place.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {place.description || 'Chưa có mô tả'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {place.categories && place.categories.length > 0 ? (
                            place.categories.map((cat, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Chưa phân loại</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="truncate">{place.address || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        <div className="flex items-start gap-1">
                          <MapPinned className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>Lat: {place.location.coordinates[1].toFixed(6)}</div>
                            <div>Lng: {place.location.coordinates[0].toFixed(6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{place.rating?.toLocaleString() ?? 'N/A'}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          ({place.userRatingsTotal ?? 0} reviews)
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {place.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{place.phone}</span>
                            </div>
                          )}
                          {place.website && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Globe className="w-3 h-3" />
                              <a 
                                href={place.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs hover:underline"
                              >
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewPlace(place)}
                            className="p-1 hover:bg-green-50 rounded text-green-600"
                            title="Xem trên bản đồ"
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
                            onClick={() => handleDeleteWithRefresh(place.id)}
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
            ) : (
              <div className="text-center py-12">
                <MapPinned className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">Không tìm thấy địa điểm</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 0 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.totalPages} 
                <span className="text-gray-400 ml-2">
                  (Tổng {pagination.total} địa điểm)
                </span>
              </p>

              <div className="flex gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>
                
                <button 
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PlaceManagement.displayName = 'PlaceManagement';

export default PlaceManagement;