import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import phygenLogo from '../assets/icons/phygen-icon.png';
import googleIcon from '../assets/icons/google-icon.png';
import api from '../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const SignIn = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { user, setUser, signInWithEmail } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      console.log('User in context after signin:', user);
    }
  }, [user]);

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
    if (!formData.email || !formData.password) {
      toast.error(t('error_fill_all_fields'), {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
      setIsLoading(false);
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      
      console.log('Data being sent to server:', loginData);
      const response = await api.post('/login', loginData);
      console.log('response', response);
      localStorage.setItem('token', response.data.token);
      
      if(response.status === 200) {
        // Decode token and set user
        const decodedToken = jwtDecode(response.data.token);
        console.log('Decoded token after login:', decodedToken);
        setUser(decodedToken);
        
        toast.success(response.data.message, {
          position: "top-center",
          theme: "light",
          autoClose: 2000
        });
        setTimeout(() => {
          if (decodedToken.roleId === "1") navigate('/');
          else if (decodedToken.roleId === "2") navigate('/admin');
          else if (decodedToken.roleId === "3") navigate('/mod');
          else navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error(error.response?.data?.message || t('error_login_failed'), {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      console.log('idToken', idToken);
      const response = await api.post('/login/google-login', {
        credential: idToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        }
      });

      localStorage.setItem('token', response.data);
      const decodedToken = jwtDecode(response.data);
      setUser(decodedToken);

      toast.success('Đăng nhập Google thành công!', {
        position: "top-center",
        theme: "light",
        autoClose: 2000
      });
      setTimeout(() => {
        if (decodedToken.roleId === "1") navigate('/');
        else if (decodedToken.roleId === "2") navigate('/admin');
        else if (decodedToken.roleId === "3") navigate('/mod');
        else navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Chi tiết lỗi:', {
        code: error.code,
        message: error.message
      });
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError(t('error_popup_closed'));
          break;
        case 'auth/popup-blocked':
          setError(t('error_popup_blocked'));
          break;
        case 'auth/cancelled-popup-request':
          setError(t('error_popup_cancelled'));
          break;
        case 'auth/network-request-failed':
          setError(t('error_network_failed'));
          break;
        default:
          setError(`${t('error_login_default')}: ${error.message}`);
      }
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
          {t('welcome_back')}
        </h1>
        <p className="text-slate-600 mt-2">{t('sign_in_to_your_phygen_account')}</p>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center text-slate-800">
            {t('sign_in')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="absolute top-4 right-4 z-10">
            <LanguageSwitcher />
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                {t('email')}
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
                  placeholder={t('enter_your_email')}
                  className="pl-10 pr-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                {t('password')}
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
                  placeholder={t('enter_your_password')}
                  className="pl-10 pr-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 inset-y-0 flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2"
            >
              {isLoading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-slate-500 text-sm">{t('or_continue_with')}</span>
            </div>
          </div>

          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
            {t('continue_with_google')}
          </Button>

          <div className="text-center text-sm text-slate-600">
            {t('dont_have_account')} {' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('sign_up_here')}
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
        <Link to="/privacy-policy" className="hover:text-slate-700">{t('terms_of_service')}</Link>
        <span>•</span>
        <Link to="/privacy-policy" className="hover:text-slate-700">{t('privacy_policy')}</Link>
        <span>•</span>
        <Link to="/data-deletion" className="hover:text-slate-700">{t('data_deletion')}</Link>
      </div>
    </div>
  );
};

export default SignIn;