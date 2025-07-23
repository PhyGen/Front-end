import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X as CloseIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Edit, Save, User, Home, FileText, Globe } from "lucide-react";
import api from '@/config/axios';
import { useAuth } from '../context/AuthContext';
import avatarIcon from '../assets/icons/avatar.jpg';
import { useTranslation } from 'react-i18next';
import { uploadImgBBOneFile } from '@/config/imgBB';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RadixModal = ({ open, onOpenChange, children }) => {
  const { t } = useTranslation(); 
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-50"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            className="bg-white dark:bg-[#242526] rounded-2xl shadow-2xl w-[800px] max-w-[95vw] max-h-[90vh] p-8 overflow-y-auto flex flex-col relative"
          >
            <Dialog.Title className="text-2xl font-bold mb-2 dark:text-white">
              {t('general_settings')}
            </Dialog.Title>
            <Dialog.Description className="text-slate-500 mb-6 dark:text-white">
              {t('update_profile_preferences')}
            </Dialog.Description>

            {children}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SettingsModal = ({ open, onOpenChange, initialView }) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    avatar: null,
    fullName: "",
    email: "",
    phoneNumber: ""
  });
  const [startPage, setStartPage] = useState(() => localStorage.getItem('startPage') || 'home');

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleStartPageChange = (page) => {
    setStartPage(page);
    localStorage.setItem('startPage', page);
  };

  const fetchProfileUser = async () => {
    if (!user || !user.id) return;
    try {
      const response = await api.get(`/users/${user.id}`);
      if (response.data) {
        setProfileData({
          avatar: response.data.avatarUrl || null,
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProfileUser();
    }
  }, [open, user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Lưu thông tin profile
      console.log("Saving profile data:", profileData);
      try {
        const response = await api.put(`/users/${user.id}/profile`, {
          fullName: profileData.fullName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          avatarUrl: profileData.avatar
        });
        
        if (response.status === 200) {
          toast.success('Profile updated successfully!');
          // Có thể cập nhật user context nếu cần
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to save profile. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarUpload = async (event) => {
    console.log('handleAvatarUpload called', event);
    console.log('Files:', event.target.files);
    
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setIsUploading(true);
      
      try {
        // Upload ảnh lên imgBB
        console.log('Uploading to imgBB...');
        const imageUrl = await uploadImgBBOneFile(file);
        console.log('Upload successful, image URL:', imageUrl);
        
        // Cập nhật state với URL từ imgBB
        setProfileData(prev => ({ ...prev, avatar: imageUrl }));
        
        // TODO: Có thể gọi API để lưu URL vào database
        // await api.put(`/users/${user.id}`, { avatarUrl: imageUrl });
        
      } catch (error) {
        console.error('Error uploading to imgBB:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleFileInputClick = () => {
    console.log('File input clicked');
    // Reset input value để có thể chọn cùng file nhiều lần
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    console.log('Upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
    <RadixModal open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-600" />
                    <CardTitle className="text-lg dark:text-white">{t('profile')}</CardTitle>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={handleEditToggle}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        {t('save')}
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        {t('edit')}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-white">{t('avatar')}</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profileData.avatar || avatarIcon} alt="Profile" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          onClick={handleFileInputClick}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                          disabled={isUploading}
                          onClick={handleUploadButtonClick}
                          type="button"
                        >
                          <Upload className="w-4 h-4" />
                          {isUploading ? t('uploading') : t('upload_image')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-white">{t('full_name')}</Label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-white">{t('email')}</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-white">{t('phone_number')}</Label>
                  <Input
                    value={profileData.phoneNumber || ''}
                    onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg dark:text-white">{t('start_page')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="start-home"
                  name="startPage"
                  value="home"
                  checked={startPage === "home"}
                  onChange={() => handleStartPageChange('home')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="start-home" className="text-sm font-medium text-slate-700 cursor-pointer dark:text-white">
                  {t('home')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="start-exam"
                  name="startPage"
                  value="myExam"
                  checked={startPage === "myExam"}
                  onChange={() => handleStartPageChange('myExam')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="start-exam" className="text-sm font-medium text-slate-700 cursor-pointer dark:text-white">
                  {t('my_exam')}
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg dark:text-white">{t('language')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="lang-english"
                  name="language"
                  value="en"
                  checked={i18n.language.startsWith('en')}
                  onChange={() => handleLanguageChange('en')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="lang-english" className="text-sm font-medium text-slate-700 cursor-pointer dark:text-white">
                  {t('english')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="lang-vietnamese"
                  name="language"
                  value="vi"
                  checked={i18n.language.startsWith('vi')}
                  onChange={() => handleLanguageChange('vi')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="lang-vietnamese" className="text-sm font-medium text-slate-700 cursor-pointer dark:text-white">
                  {t('vietnamese')}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RadixModal>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default SettingsModal;