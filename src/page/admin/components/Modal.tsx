import React, { useState } from 'react';
import { Users, MapPin, Home, X, Save, Mail, Phone, Globe, Clock, MapPinned } from 'lucide-react';
import type { User, Place, Stats, TabType, ModalType } from '../../../type/admin.types';
interface ModalProps {
  type: ModalType;
  item: User | Place | null;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ type, item, onClose }) => {
  const isUser = type.includes('User');
  const isEdit = type.includes('edit');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">
            {isEdit ? 'Chỉnh sửa' : 'Thêm'} {isUser ? 'User' : 'Place'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isUser ? (
            <UserForm user={isEdit ? item as User : null} onClose={onClose} />
          ) : (
            <PlaceForm place={isEdit ? item as Place : null} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

// User Form Component
interface UserFormProps {
  user: User | null;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [formData, setFormData] = React.useState({
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || 'user',
    authProvider: user?.authProvider || 'local',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit user:', formData);
    // TODO: Call API
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user?.id && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">ID</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            value={user.id}
            disabled
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            required
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Auth Provider *</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.authProvider}
            onChange={(e) => setFormData({...formData, authProvider: e.target.value as 'local' | 'google'})}
          >
            <option value="local">Local</option>
            <option value="google">Google</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          {user ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  );
};

// Place Form Component
interface PlaceFormProps {
  place: Place | null;
  onClose: () => void;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ place, onClose }) => {
  const [formData, setFormData] = React.useState({
    name: place?.name || '',
    categories: place?.categories || '',
    description: place?.description || '',
    address: place?.address || '',
    longitude: place?.location.coordinates[0] || 0,
    latitude: place?.location.coordinates[1] || 0,
    rating: place?.rating || 0,
    userRatingsTotal: place?.userRatingsTotal || 0,
    phone: place?.phone || '',
    website: place?.website || '',
    imageThumbnail: place?.imageThumbnail || '',
    open_hour: place?.open_hour || '',
    close_hour: place?.close_hour || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit place:', formData);
    // TODO: Call API
    onClose();
  };

  return (
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
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categories</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="hotel,luxury,spa"
          value={formData.categories}
          onChange={(e) => setFormData({...formData, categories: e.target.value})}
        />
        <p className="text-xs text-gray-500 mt-1">Phân cách bằng dấu phẩy</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>

      <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <MapPinned className="w-4 h-4" />
          Location (GEOMETRY POINT) *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.longitude}
              onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.latitude}
              onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">User Ratings Total</label>
          <input
            type="number"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.userRatingsTotal}
            onChange={(e) => setFormData({...formData, userRatingsTotal: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image Thumbnail URL</label>
        <input
          type="url"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.imageThumbnail}
          onChange={(e) => setFormData({...formData, imageThumbnail: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Open Hour
          </label>
          <input
            type="time"
            step="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.open_hour}
            onChange={(e) => setFormData({...formData, open_hour: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Close Hour
          </label>
          <input
            type="time"
            step="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.close_hour}
            onChange={(e) => setFormData({...formData, close_hour: e.target.value})}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          {place ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  );
};