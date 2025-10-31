// components/admin/Dashboard.tsx
import React from 'react';
import { Users, MapPin, CheckCircle } from 'lucide-react';
import type { User, Place, Stats } from '../../../type/admin.types';

interface DashboardProps {
  stats: Stats;
  users: User[];
  places: Place[];
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const colors: Record<StatCardProps['color'], string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ stats, users, places }) => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          icon={<Users className="w-8 h-8" />}
          title="Tổng Users"
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard 
          icon={<CheckCircle className="w-8 h-8" />}
          title="Users Active"
          value={stats.activeUsers}
          color="green"
        />
        <StatCard 
          icon={<MapPin className="w-8 h-8" />}
          title="Tổng Places"
          value={stats.totalPlaces}
          color="purple"
        />
        <StatCard 
          icon={<Users className="w-8 h-8" />}
          title="Users mới (tháng)"
          value={stats.newUsers}
          color="yellow"
        />
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Places */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Places mới nhất</h3>
          <div className="space-y-3">
            {places.slice(0, 5).map(place => (
              <div key={place.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{place.name}</p>
                  <p className="text-sm text-gray-500">{place.categories}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★ {place.rating?.toFixed(1) ?? 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        {users.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Users mới đăng ký</h3>
          {/* <div className="space-y-3">
            {users?.slice(0, 5)?.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div> */}
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;