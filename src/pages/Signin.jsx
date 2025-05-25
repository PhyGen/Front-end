import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import phygenLogo from '../assets/icons/phygen-logo.png';
import googleIcon from '../assets/icons/google-icon.png';
import facebookIcon from '../assets/icons/facebook-icon.png';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const SignIn = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Đăng nhập thành công:', result.user);
      navigate('/');
    } catch (error) {
      console.error('Chi tiết lỗi:', {
        code: error.code,
        message: error.message
      });
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.');
          break;
        case 'auth/popup-blocked':
          setError('Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại.');
          break;
        case 'auth/cancelled-popup-request':
          setError('Yêu cầu đăng nhập đã bị hủy. Vui lòng thử lại.');
          break;
        case 'auth/network-request-failed':
          setError('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.');
          break;
        default:
          setError(`Lỗi đăng nhập: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9ff] flex flex-col items-center justify-center">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center mb-6">
        <img src={phygenLogo} alt="PhyGen Logo" className="w-26 h-26 mb-2" />
        <h2 className="text-2xl font-semibold text-blue-700">Sign in</h2>
      </div>

      {/* Form box */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md px-6 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Your email address, phone or username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              required
            />
            <span 
              className="absolute right-3 top-1/2 transform translate-y-1 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-medium text-sm"
          >
            Sign in
          </button>
        </form>

        {/* Social buttons */}
        <div className="space-y-2 mt-4">
          <button 
            onClick={signInWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <FacebookLogin
            appId="586226720625781"
            onSuccess={(response) => {
              console.log(response);
              if (response.accessToken) {
                alert("Đăng nhập thành công với Facebook!");
                console.log("Đăng nhập thành công với Facebook!");
                navigate('/');
              }
            }}
            onFail={(error) => {
              console.log("Đăng nhập thất bại:", error);
              setError("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
            Continue with Facebook
          </FacebookLogin>
        </div>

        {/* Sign up link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-700 hover:underline">Sign up</Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs">
        <Link to="/privacy-policy" className="text-blue-700 hover:underline">Terms of Service</Link>
        {' '}&bull;{' '}
        <Link to="/privacy-policy" className="text-blue-700 hover:underline">Privacy Policy</Link>
        {' '}&bull;{' '}
        <Link to="/data-deletion" className="text-blue-700 hover:underline">Data Deletion</Link>
      </div>
    </div>
  );
};

export default SignIn;