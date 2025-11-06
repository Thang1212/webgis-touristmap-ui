// components/admin/CategoryManagement.tsx
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  placeCount: number;
}

interface CategoryManagementProps {
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: number) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock data
  const categories: Category[] = [
    { id: 1, name: 'Nhà hàng', placeCount: 234 },
    { id: 2, name: 'Quán cà phê', placeCount: 156 },
    { id: 3, name: 'Khách sạn', placeCount: 89 },
    { id: 4, name: 'Bãi biển', placeCount: 45 },
    { id: 5, name: 'Tourist Attraction', placeCount: 178 },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm category..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={onAddCategory}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 ml-4"
          >
            <Plus className="w-4 h-4" />
            Thêm Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số Places</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{category.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded">
                        <FolderOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      {category.placeCount} places
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEditCategory(category)}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteCategory(category.id)}
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

        {/* Stats Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Tổng: <span className="font-semibold">{categories.length}</span> categories | 
            <span className="ml-2">Tổng places: <span className="font-semibold">
              {categories.reduce((sum, cat) => sum + cat.placeCount, 0)}
            </span></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;