import React, { use, useEffect, useState } from 'react';
import { Users, MapPin, Home, X, Save, Mail, Phone, Globe, Clock, MapPinned } from 'lucide-react';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PlaceManagement from './components/PlaceManagement';
import type { User, Place, Stats, TabType, ModalType } from '../../type/admin.types';
import { Modal } from './components/Modal';
import axios from 'axios';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>('addUser');
  const [selectedItem, setSelectedItem] = useState<User | Place | null>(null);
  const [users, setUsers] = useState<User[] | null>([]);
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/admin');
    const data = response.data.data.users;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
    })
  },[])
  // Mock data theo types mới
  const stats: Stats = {
    totalUsers: 1234,
    totalPlaces: 567,
    activeUsers: 1150,
    newUsers: 45
  };


  const places: Place[] = [
    { 
      id: 1,
      name: 'Chú Dư đồ cổ',
      categories: 'tourist_attraction',
      description: 'Thông tin chưa có mô tả',
      address: 'Xuân An, Tp. Phan Thiết',
      location: { type: 'Point', coordinates: [108.104282, 10.947292] },
      rating: 5.0,
      userRatingsTotal: 5,
      phone: undefined,
      website: undefined,
      imageThumbnail: 'https://lh3.googleusercontent.com/gps-cs-s/...',
      open_hour: '08:00:00',
      close_hour: '18:00:00',
      createdAt: '2024-01-15T10:30:00Z'
    },
    { 
      id: 2,
      name: 'Bãi biển Mũi Né',
      categories: 'beach,tourist_attraction',
      description: 'Bãi biển đẹp nổi tiếng với cồn cát bay',
      address: 'Mũi Né, Phan Thiết, Bình Thuận',
      location: { type: 'Point', coordinates: [108.283333, 10.933333] },
      rating: 4.8,
      userRatingsTotal: 234,
      phone: '0252123456',
      website: 'https://muinebeach.com',
      imageThumbnail: 'https://example.com/muine.jpg',
      open_hour: '00:00:00',
      close_hour: '23:59:00',
      createdAt: '2024-02-10T09:00:00Z'
    },
  ];

  // Handlers
  const handleAddUser = (): void => {
    setSelectedItem(null);
    setModalType('addUser');
    setShowModal(true);
  };

  const handleEditUser = (user: User): void => {
    setSelectedItem(user);
    setModalType('editUser');
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      console.log('Delete user:', userId);
      try {
        const response = await axios.delete(`/api/admin/${userId}`);
        console.log('User deleted:', response.data);

        setUsers((prev) => prev.filter((user) => user.id !== userId));

      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Không thể xóa user. Vui lòng thử lại!');
      }
    }
  };

  const handleAddPlace = (): void => {
    setSelectedItem(null);
    setModalType('addPlace');
    setShowModal(true);
  };

  const handleEditPlace = (place: Place): void => {
    setSelectedItem(place);
    setModalType('editPlace');
    setShowModal(true);
  };

  const handleDeletePlace = (placeId: number): void => {
    if (window.confirm('Bạn có chắc muốn xóa place này?')) {
      console.log('Delete place:', placeId);
      // TODO: Call API to delete place
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 pt-10">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">WebGIS Du lịch</p>
        </div>
        
        <nav className="p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition ${
              activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Quản lý User
          </button>
          
          <button
            onClick={() => setActiveTab('places')}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition ${
              activeTab === 'places' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-5 h-5 mr-3" />
            Quản lý Place
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'users' && 'Quản lý Users'}
            {activeTab === 'places' && 'Quản lý Places'}
          </h2>
        </div>

        {/* Content - Render tabs */}
        <div className="p-6">
          {(activeTab === 'dashboard' && users.length > 0) && (
            <Dashboard stats={stats} users={users} places={places} />
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'places' && (
            <PlaceManagement
              places={places}
              onAddPlace={handleAddPlace}
              onEditPlace={handleEditPlace}
              onDeletePlace={handleDeletePlace}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal 
          type={modalType} 
          item={selectedItem}
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

// Modal Component


export default AdminPage;