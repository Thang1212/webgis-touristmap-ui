// import React, { useState } from 'react';
// import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { toast } from 'react-hot-toast';
// import api from '@/api/axios';

// const ProfileInfo: React.FC = () => {
//   const { user, checkAuth } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(user?.name || '');
//   const [isSaving, setIsSaving] = useState(false);

//   if (!user) return null;

//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast.error('Tên không được để trống');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       await api.put('/auth/profile', { name: name.trim() });
//       await checkAuth(); // Refresh user data
//       toast.success('Cập nhật thông tin thành công');
//       setIsEditing(false);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Không thể cập nhật');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setName(user?.name || '');
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
//         {!isEditing ? (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//           >
//             <Edit2 className="w-4 h-4" />
//             Chỉnh sửa
//           </button>
//         ) : (
//           <div className="flex gap-2">
//             <button
//               onClick={handleCancel}
//               disabled={isSaving}
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <X className="w-4 h-4" />
//               Hủy
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
//             >
//               {isSaving ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4" />
//               )}
//               Lưu
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Avatar */}
//       <div className="flex items-center gap-6 mb-8">
//         <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
//           {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-900">
//             {user.name || 'Chưa cập nhật tên'}
//           </h3>
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//       </div>

//       {/* Info Grid */}
//       <div className="space-y-6">
//         {/* Name */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//             <User className="w-4 h-4" />
//             Họ và tên
//           </label>
//           {isEditing ? (
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Nhập họ và tên"
//             />
//           ) : (
//             <p className="text-gray-900">{user.name || 'Chưa cập nhật'}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//             <Mail className="w-4 h-4" />
//             Email
//           </label>
//           <p className="text-gray-900">{user.email}</p>
//         </div>

//         {/* Role */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//             <Shield className="w-4 h-4" />
//             Vai trò
//           </label>
//           <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//             user.role === 'admin' 
//               ? 'bg-purple-100 text-purple-700' 
//               : 'bg-blue-100 text-blue-700'
//           }`}>
//             {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
//           </span>
//         </div>

//         {/* Auth Provider */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//             <Shield className="w-4 h-4" />
//             Phương thức đăng nhập
//           </label>
//           <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//             user.authProvider === 'google'
//               ? 'bg-red-100 text-red-700'
//               : 'bg-green-100 text-green-700'
//           }`}>
//             {user.authProvider === 'google' ? 'Google' : 'Email/Password'}
//           </span>
//         </div>

//         {/* Created Date */}
//         {user.createdAt && (
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
//               <Calendar className="w-4 h-4" />
//               Ngày tham gia
//             </label>
//             <p className="text-gray-900">
//               {new Date(user.createdAt).toLocaleDateString('vi-VN', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//               })}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileInfo;
import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit2, Save, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';

const ProfileInfo: React.FC = () => {
  const { user, checkAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Tên không được để trống');
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/auth/profile', { name: name.trim() });
      await checkAuth();
      toast.success('Cập nhật thông tin thành công');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header with Avatar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          
          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name || 'Chưa cập nhật tên'}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            
            {/* Role Badge */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </span>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user.authProvider === 'google'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {user.authProvider === 'google' ? 'Google' : 'Email'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Hủy</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Lưu</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Name Field */}
      {isEditing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập họ và tên"
            autoFocus
          />
        </div>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        {user.createdAt && (
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              Ngày tham gia
            </label>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;