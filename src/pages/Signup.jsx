import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import phygenLogo from '../assets/icons/phygen-icon.png';
import googleIcon from '../assets/icons/google-icon.png';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <ToastContainer />
      
      {/* Logo & Heading */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
          <img src={phygenLogo} alt="PhyGen Logo" className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create account
        </h1>
        <p className="text-slate-600 mt-2">Join PhyGen and start managing your exams</p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center text-slate-800">
            Sign up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Full Name
              </Label>
              <div className="relative flex items-center h-9">
                <span className="absolute left-3 inset-y-0 flex items-center">
                  <User className="text-slate-400 w-4 h-4" />
                </span>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-10 pr-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <div className="relative flex items-center h-9">
                <span className="absolute left-3 inset-y-0 flex items-center">
                  <Mail className="text-slate-400 w-4 h-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="pl-10 pr-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <div className="relative flex items-center h-9">
                <span className="absolute left-3 inset-y-0 flex items-center">
                  <Lock className="text-slate-400 w-4 h-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 inset-y-0 flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative flex items-center h-9">
                <span className="absolute left-3 inset-y-0 flex items-center">
                  <Lock className="text-slate-400 w-4 h-4" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 inset-y-0 flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-slate-500 text-sm">or continue with</span>
            </div>
          </div>

          <Button
            onClick={signUpWithGoogle}
            variant="outline"
            className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
        <Link to="/privacy-policy" className="hover:text-slate-700">Terms of Service</Link>
        <span>•</span>
        <Link to="/privacy-policy" className="hover:text-slate-700">Privacy Policy</Link>
        <span>•</span>
        <Link to="/data-deletion" className="hover:text-slate-700">Data Deletion</Link>
      </div>
    </div>
  );
};

export default Signup;
