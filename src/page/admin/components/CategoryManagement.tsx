
import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Category {
  id: number;
  name: string;
  placeCount: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // ================= Fetch categories =================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/categories');
      const data: Category[] = res.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        placeCount: Number(cat.placeCount || 0),
      }));
      setCategories(data);
    } catch (err: any) {
      toast.error('Lỗi khi tải categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= Open Modal =================
  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  // ================= Delete category =================
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa category này?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Xóa category thành công!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa category');
    }
  };

  // ================= Filter search =================
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <Toaster position="top-right" />
      {loading && <p>Đang tải categories...</p>}

      {!loading && (
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm category..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 ml-4"
            >
              <Plus className="w-4 h-4" /> Thêm Category
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số địa điểm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{category.id}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded">
                        <FolderOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        {category.placeCount} địa điểm
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEditModal(category)} className="p-1 hover:bg-blue-50 rounded text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Tổng: <span className="font-semibold">{categories.length}</span> danh mục |{' '}
              <span className="ml-2">
                Tổng địa điểm: <span className="font-semibold">{categories.reduce((sum, cat) => sum + cat.placeCount, 0)}</span>
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ================= Modal ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">{editingCategory ? 'Chỉnh sửa Category' : 'Thêm Category'}</h3>

            <Formik
              initialValues={{ name: editingCategory?.name || '' }}
              validationSchema={Yup.object({ name: Yup.string().required('Bắt buộc') })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  if (editingCategory) {
                    const res = await axios.put(`/admin/categories/${editingCategory.id}`, values);
                    setCategories(prev =>
                      prev.map(cat => (cat.id === res.data.data.id ? { ...cat, name: res.data.data.name } : cat))
                    );
                    toast.success('Cập nhật thành công!');
                  } else {
                    const res = await axios.post('/admin/categories', values);
                    setCategories(prev => [...prev, { id: res.data.data.id, name: res.data.data.name, placeCount: 0 }]);
                    toast.success('Thêm category thành công!');
                  }
                  setModalOpen(false);
                } catch (err: any) {
                  toast.error(err.response?.data?.message || 'Lỗi thao tác');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-3">
                  <div>
                    <Field
                      name="name"
                      placeholder="Tên category"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    {editingCategory ? 'Cập nhật' : 'Thêm'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
