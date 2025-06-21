import React, { useState, useEffect } from 'react';
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

const RadixModal = ({ open, onOpenChange, children }) => {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            background: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            inset: 0,
            zIndex: 50,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            width: '800px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            padding: '2rem',
            zIndex: 51,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Dialog.Title style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            {t('general_settings')}
          </Dialog.Title>
          <Dialog.Description style={{ color: '#64748b', marginBottom: 24 }}>
            {t('update_profile_preferences')}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.7,
              }}
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SettingsModal = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    avatar: null,
    fullName: "",
    email: "",
    phoneNumber: null
  });
  const [startPage, setStartPage] = useState(() => localStorage.getItem('startPage') || 'home');
  const [pdfOpenMode, setPdfOpenMode] = useState("new-card");

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
      const response = await api.get(`/Account/${user.id}`);
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

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Saving profile data:", profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <RadixModal open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-600" />
                    <CardTitle className="text-lg">{t('profile')}</CardTitle>
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
                  <Label className="text-sm font-medium text-slate-700">{t('avatar')}</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profileData.avatar || avatarIcon} alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <label htmlFor="avatar-upload">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            {t('upload_image')}
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('full_name')}</Label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('email')}</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('phone_number')}</Label>
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
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
                <CardTitle className="text-lg">{t('start_page')}</CardTitle>
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
                <Label htmlFor="start-home" className="text-sm font-medium text-slate-700 cursor-pointer">
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
                <Label htmlFor="start-exam" className="text-sm font-medium text-slate-700 cursor-pointer">
                  {t('my_exam')}
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">{t('language')}</CardTitle>
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
                <Label htmlFor="lang-english" className="text-sm font-medium text-slate-700 cursor-pointer">
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
                <Label htmlFor="lang-vietnamese" className="text-sm font-medium text-slate-700 cursor-pointer">
                  {t('vietnamese')}
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">{t('open_pdf_file')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="pdf-new-card"
                  name="pdfOpenMode"
                  value="new-card"
                  checked={pdfOpenMode === "new-card"}
                  onChange={(e) => setPdfOpenMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="pdf-new-card" className="text-sm font-medium text-slate-700 cursor-pointer">
                  {t('new_card')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="pdf-preview"
                  name="pdfOpenMode"
                  value="preview"
                  checked={pdfOpenMode === "preview"}
                  onChange={(e) => setPdfOpenMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="pdf-preview" className="text-sm font-medium text-slate-700 cursor-pointer">
                  {t('preview')}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RadixModal>
  );
};

export default SettingsModal; 