import { useNavigate } from 'react-router-dom';
import LoginForm from './LogInForm';

export function LogIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <LoginForm
        onSubmit={(data) => {
         // console.log(data);
          // Xử lý login của bạn, rồi:
          navigate('/dashboard');
        }}
        onGoogleClick={() => {
          // Xử lý Google OAuth
        }}
        onFacebookClick={() => {
          // Xử lý Facebook OAuth
        }}
      />
    </div>
  );
}