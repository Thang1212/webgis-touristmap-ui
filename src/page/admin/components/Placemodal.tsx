import React, { useState, useEffect } from 'react';
import { X, Save, Phone, Globe, Clock, MapPin, MapPinned, Search, Loader2, AlertCircle } from 'lucide-react';
import type { Place } from '../../../type/admin.types';
import axios from 'axios';
import toast from 'react-hot-toast';
import geocodingService from '../../../services/geocoding.service';

interface PlaceModalProps {
  place: Place | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface GeocodeResult {
  latitude: number;
  longitude: number;
  place_name: string;
  formatted_address: string;
  text: string;
  relevance: number;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({ place, onClose, onSuccess }) => {
  const isEdit = !!place;

  const [formData, setFormData] = useState({
    name: place?.name || '',
    categoryIds: place?.categories?.map(c => c.id) || [],
    description: place?.description || '',
    address: place?.address || '',
    longitude: place?.location?.coordinates?.[0] || '',
    latitude: place?.location?.coordinates?.[1] || '',
    phone: place?.phone || '',
    website: place?.website || '',
    open_hour: place?.open_hour || '',
    close_hour: place?.close_hour || '',
    auto_geocode: true
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(place?.imageThumbnail || '');
  
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [showGeocodeResults, setShowGeocodeResults] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('/api/places/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Không thể tải danh mục');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Debounced geocoding
  useEffect(() => {
    if (!formData.address || !formData.auto_geocode || formData.address.length < 5) {
      setGeocodeResults([]);
      setShowGeocodeResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      await handleGeocode(formData.address);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.address, formData.auto_geocode]);

  const handleGeocode = async (address: string) => {
    if (!address || address.length < 5) return;

    setIsGeocoding(true);
    setGeocodeError('');
    
    try {
      const result = await geocodingService.geocodeAddress(address);
      
      if (result.success && result.results.length > 0) {
        setGeocodeResults(result.results);
        setShowGeocodeResults(true);
        
        // Auto-select first result
        if (result.primary) {
          setFormData(prev => ({
            ...prev,
            latitude: result.primary!.latitude.toString(),
            longitude: result.primary!.longitude.toString()
          }));
        }
        
        toast.success('✅ Đã tìm thấy tọa độ');
      } else {
        setGeocodeError('Không tìm thấy địa chỉ này');
        toast.error('Không tìm thấy tọa độ cho địa chỉ này');
      }
    } catch (error: any) {
      console.error('Geocoding failed:', error);
      setGeocodeError('Lỗi khi tìm tọa độ');
      toast.error('Không thể tìm tọa độ. Vui lòng nhập thủ công');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSelectGeocode = (result: GeocodeResult) => {
    setFormData(prev => ({
      ...prev,
      latitude: result.latitude.toString(),
      longitude: result.longitude.toString(),
      address: result.formatted_address
    }));
    setShowGeocodeResults(false);
    toast.success('Đã chọn địa chỉ');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error('Vui lòng cung cấp tọa độ');
      return;
    }

    // Validate coordinates
    if (!geocodingService.validateCoordinates(formData.latitude, formData.longitude)) {
      toast.error('Tọa độ không hợp lệ (phải nằm trong Việt Nam)');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('address', formData.address);
    submitData.append('latitude', formData.latitude);
    submitData.append('longitude', formData.longitude);
    
    if (formData.phone) submitData.append('phone', formData.phone);
    if (formData.website) submitData.append('website', formData.website);
    if (formData.open_hour) submitData.append('open_hour', formData.open_hour);
    if (formData.close_hour) submitData.append('close_hour', formData.close_hour);
    
    submitData.append('categoryIds', JSON.stringify(formData.categoryIds));
    
    if (image) {
      submitData.append('image', image);
    }

    try {
    //   console.log(submitData) 
      if (place?.id) {
        await axios.patch(`/api/admin/place/${place.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Cập nhật địa điểm thành công!');
      } else {
        await axios.post('/api/admin/place', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Thêm địa điểm thành công!');

      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting place:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa điểm');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">
            {isEdit ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {place?.id && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-500">ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  value={place.id}
                  disabled
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tên địa điểm *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nhập tên địa điểm..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-gray-500 p-3 border rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải danh mục...
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Selected categories display */}
                  {formData.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.categoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? (
                          <span
                            key={catId}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {category.name}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  categoryIds: formData.categoryIds.filter(id => id !== catId)
                                });
                              }}
                              className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Category selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg max-h-64 overflow-y-auto">
                    {categories.map(cat => (
                      <label
                        key={cat.id}
                        className={`
                          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                          ${formData.categoryIds.includes(cat.id)
                            ? 'bg-green-100 border-2 border-green-500 text-green-900'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                categoryIds: [...formData.categoryIds, cat.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter(id => id !== cat.id)
                              });
                            }
                          }}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </label>
                    ))}
                  </div>

                  {formData.categoryIds.length === 0 && (
                    <p className="text-xs text-gray-500 italic">Chưa chọn danh mục nào</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Mô tả về địa điểm..."
              />
            </div>

            {/* ADDRESS & GEOCODING SECTION */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Địa chỉ & Tọa độ
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_geocode}
                    onChange={(e) => setFormData({...formData, auto_geocode: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-700">Tự động lấy tọa độ</span>
                </label>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="VD: Bến Thành Market, Hồ Chí Minh..."
                  />
                  {isGeocoding && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />
                  )}
                  {!isGeocoding && formData.auto_geocode && formData.address && (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                </div>
                {formData.auto_geocode && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Tọa độ sẽ tự động được tìm kiếm sau khi bạn nhập địa chỉ
                  </p>
                )}
              </div>

              {geocodeError && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{geocodeError}</span>
                </div>
              )}

              {showGeocodeResults && geocodeResults.length > 1 && (
                <div className="bg-white border-2 border-blue-300 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Tìm thấy {geocodeResults.length} kết quả. Chọn địa chỉ chính xác:
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {geocodeResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectGeocode(result)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-100 rounded transition-colors border border-transparent hover:border-blue-400"
                      >
                        <div className="font-medium text-gray-900">{result.text}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{result.formatted_address}</div>
                        <div className="text-xs text-blue-600 mt-1 font-mono">
                          📍 {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Kinh độ (Longitude) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="106.xxxxx"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Vĩ độ (Latitude) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="10.xxxxx"
                  />
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded border border-blue-200">
                  <MapPinned className="w-4 h-4 text-blue-600" />
                  <span className="font-mono">
                    {parseFloat(formData?.latitude).toFixed(6)}, {parseFloat(formData?.longitude).toFixed(6)}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0123456789"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="url"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p className="text-xs text-gray-500 mt-1">Kích thước tối đa: 5MB</p>
              {imagePreview && (
                <div className="mt-3 relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-40 w-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  Giờ mở cửa
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.open_hour}
                  onChange={(e) => setFormData({...formData, open_hour: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-red-600" />
                  Giờ đóng cửa
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.close_hour}
                  onChange={(e) => setFormData({...formData, close_hour: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isGeocoding}
              >
                <Save className="w-4 h-4" />
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};