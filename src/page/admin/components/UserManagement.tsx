// components/admin/UserManagement.tsx
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Shield } from 'lucide-react';
import type { User } from '../../../type/admin.types';

interface UserManagementProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('');

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
                placeholder="Tìm kiếm user..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <select 
              className="px-4 py-2 border rounded-lg"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tất cả Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select 
              className="px-4 py-2 border rounded-lg"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="">Tất cả Provider</option>
              <option value="local">Local</option>
              <option value="google">Google</option>
            </select> */}
          </div>
          {/* <button 
            onClick={onAddUser}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-4"
          >
            <Plus className="w-4 h-4" />
            Thêm User
          </button> */}
        </div>

        {/* Users Table */}
        {
          users.length > 0 && (
                    <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                    {user.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.authProvider === 'google' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.authProvider}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEditUser(user)}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteUser(user.id)}
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

          )
        } 
        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">Hiển thị 1-{users.length} trong tổng số {users.length} users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;