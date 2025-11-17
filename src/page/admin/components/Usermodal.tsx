import React from 'react';
import { X, Save, Mail } from 'lucide-react';
import type { User } from '../../../type/admin.types';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSuccess }) => {
  const isEdit = !!user;

  const [formData, setFormData] = React.useState({
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || 'user',
    authProvider: user?.authProvider || 'local',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.patch(`/api/admin/${user.id}`, formData);
        toast.success('Đã cập nhật thông tin người dùng');
      } else {
        await axios.post('/api/admin', formData);
        toast.success('Đã thêm người dùng mới');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">
            {isEdit ? 'Chỉnh sửa User' : 'Thêm User mới'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
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
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};