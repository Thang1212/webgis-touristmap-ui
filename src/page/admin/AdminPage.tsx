
import React, { useEffect, useState, useRef } from 'react';
import { Users, MapPin, Home, List, MessageSquare, Video as VideoIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PlaceManagement from './components/PlaceManagement';
import type { PlaceManagementRef } from './components/PlaceManagement';
import CategoryManagement from './components/CategoryManagement';
import ReviewManagement from './components/ReviewManagement';
import VideoManagement from './components/VideoManagement';
import { UserModal}  from './components/Usermodal';
import { PlaceModal } from './components/Placemodal';
import type { User, Place, Stats, TabType, ModalType } from '../../type/admin.types';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const placeManagementRef = useRef<PlaceManagementRef>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showPlaceModal, setShowPlaceModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPlaces: 0,
    activeUsers: 0,
    newUsers: 0
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin');
      const data = response.data.data.users;
      setUsers(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách users');
      return [];
    }
  };

  // Fetch Places
  const fetchPlaces = async () => {
    try {
      const response = await axios.get('/api/admin/places');
      const data = response.data.data;
      setPlaces(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching places:', error);
      toast.error('Không thể tải danh sách places');
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPlaces()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // User handlers
  const handleAddUser = (): void => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User): void => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        await axios.delete(`/api/admin/${userId}`);
        toast.success('Xóa user thành công!');
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (error: any) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Không thể xóa user');
      }
    }
  };

  // Place handlers
  const handleAddPlace = (): void => {
    setSelectedPlace(null);
    setShowPlaceModal(true);
  };

  const handleEditPlace = (place: Place): void => {
    setSelectedPlace(place);
    setShowPlaceModal(true);
  };

  const handleDeletePlace = async (placeId: number): Promise<void> => {
    if (window.confirm('Bạn có chắc muốn xóa địa điểm này?')) {
      try {
        await axios.delete(`/api/admin/place/${placeId}`);
        toast.success('Xóa địa điểm thành công!');
        // No need to update state here, PlaceManagement will refresh itself
      } catch (error: any) {
        console.error('Error deleting place:', error);
        toast.error(error.response?.data?.message || 'Không thể xóa địa điểm');
      }
    }
  };

  // Handle place success (add/edit)
  const handlePlaceSuccess = async () => {
    // Trigger refresh in PlaceManagement component
    await placeManagementRef.current?.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 pt-16">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">WebGIS Du lịch</p>
        </div>
        
        <nav className="p-4">
          <NavButton
            icon={<Home className="w-5 h-5 mr-3" />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          
          <NavButton
            icon={<Users className="w-5 h-5 mr-3" />}
            label="Quản lý User"
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          
          <NavButton
            icon={<MapPin className="w-5 h-5 mr-3" />}
            label="Quản lý địa điểm"
            active={activeTab === 'places'}
            onClick={() => setActiveTab('places')}
          />

          <NavButton
            icon={<List className="w-5 h-5 mr-3" />}
            label="Quản lý danh mục"
            active={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
          />
          
          <NavButton
            icon={<MessageSquare className="w-5 h-5 mr-3" />}
            label="Quản lý đánh giá"
            active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          />

          <NavButton
            icon={<VideoIcon className="w-5 h-5 mr-3" />}
            label="Quản lý video"
            active={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm p-6 border-b sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'users' && 'Quản lý Users'}
            {activeTab === 'places' && 'Quản lý địa điểm'}
            {activeTab === 'categories' && 'Quản lý danh mục'}
            {activeTab === 'reviews' && 'Quản lý đánh giá'}
            {activeTab === 'video' && 'Quản lý video'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
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
              ref={placeManagementRef}
              places={places}
              onAddPlace={handleAddPlace}
              onEditPlace={handleEditPlace}
              onDeletePlace={handleDeletePlace}
            />
          )}
          
          {activeTab === 'categories' && <CategoryManagement />}
          
          {activeTab === 'reviews' && <ReviewManagement />}
          
          {activeTab === 'video' && <VideoManagement />}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal 
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }} 
          onSuccess={fetchUsers}
        />
      )}

      {/* Place Modal */}
      {showPlaceModal && (
        <PlaceModal 
          place={selectedPlace}
          onClose={() => {
            setShowPlaceModal(false);
            setSelectedPlace(null);
          }} 
          onSuccess={handlePlaceSuccess}
        />
      )}
    </div>
  );
};

// Navigation Button Component
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-2 rounded-lg transition-all ${
      active 
        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
        : 'hover:bg-gray-50 text-gray-700'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default AdminPage;