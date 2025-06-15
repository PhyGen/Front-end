import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import phygenLogo from '../assets/icons/phygen-icon.png';
import googleIcon from '../assets/icons/google-icon.png';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import api from '../config/axios';
import { ToastContainer, toast } from 'react-toastify';


const Signup = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin', {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp', {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự', {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
      setIsLoading(false);
      return;
    }

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name
      };
      
      console.log('Data being sent to server:', signupData);
      const response = await api.post('signup', signupData);
      if(response.status === 200){
        toast.success(response.data.message, {
          position: "top-center",
          theme: "light",
          autoClose: 2000
        });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Đăng ký thành công:', result.user);
      navigate('/');
    } catch (error) {
      console.error('Chi tiết lỗi:', {
        code: error.code,
        message: error.message
      });
      
      let errorMessage = 'Có lỗi xảy ra khi đăng ký';
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Cửa sổ đăng ký đã bị đóng. Vui lòng thử lại.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Yêu cầu đăng ký đã bị hủy. Vui lòng thử lại.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
          break;
        default:
          errorMessage = `Lỗi đăng ký: ${error.message}`;
      }
      toast.error(errorMessage, {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9ff] flex flex-col items-center justify-center">
      <ToastContainer />
      {/* Logo & Heading */}
      <div className="flex flex-col items-center mb-6">
        <img src={phygenLogo} alt="PhyGen Logo" className="w-26 h-26 mb-2" />
        <h2 className="text-2xl font-semibold text-blue-700">Sign up</h2>
      </div>

      {/* Form box */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md px-6 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
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
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              required
            />
            <span 
              className="absolute right-3 top-1/2 transform translate-y-1 text-gray-400 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Create Account'}
          </button>
        </form>

        {/* Social buttons */}
        <div className="space-y-2 mt-4">
          <button 
            onClick={signUpWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition text-sm"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        {/* Sign in link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account? <Link to="/signin" className="text-blue-700 hover:underline">Sign in</Link>
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

export default Signup;
