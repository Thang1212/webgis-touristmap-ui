import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layout/components/MainLayout'
import Homepage from './page/homepage/Homepage'
import Mappage from './page/mappape/Mappage'
import {LoginForm} from './page/auth_page/LogInForm'
import {RegisterForm} from './page/auth_page/RegisterForm'
import { useAuth } from './hooks/useAuth'
import { useEffect } from 'react'
import AdminPage from './page/admin/AdminPage'
import ProfilePage from './page/ProfilePage/ProfilePage'

function App() {
  const {isAuthenticated, isAdmin} = useAuth();
  return (
    <>
      <Routes>
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="map" element={<Mappage />} />
          <Route
            path="admin"
            element={
              isAuthenticated && isAdmin ? <AdminPage /> : <Mappage />
            }
          />
          <Route path="profile" element={<ProfilePage/>} />
        </Route>
          <Route path="/login" element={ isAuthenticated ? <Mappage /> : <LoginForm />} />
          <Route path="/register" element={isAuthenticated ? <Mappage /> : <RegisterForm />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
      </Routes>

      <Toaster />
    </>
  )
}
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const fallbackAccessToken = params.get('ft');
    const fallbackRefreshToken = params.get('fr');

    if (success === 'true') {
      // Lưu tokens vào localStorage (Firefox/Safari)
      if (fallbackAccessToken && fallbackRefreshToken) {
        localStorage.setItem('access_token', fallbackAccessToken);
        localStorage.setItem('refresh_token', fallbackRefreshToken);
        console.log('🦊 Firefox/Safari: Using localStorage');
      } else {
        console.log('🍪 Chrome: Using cookies');
      }

      window.history.replaceState({}, '', '/auth/callback?success=true');
      checkAuth();
      navigate('/map');
    } else {
      navigate('/login');
    }
  }, [navigate, checkAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Processing Google login...</div>
    </div>
  );
};
export default App
