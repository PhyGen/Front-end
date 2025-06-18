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

const RadixModal = ({ open, onOpenChange, children }) => {
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
            General Settings
          </Dialog.Title>
          <Dialog.Description style={{ color: '#64748b', marginBottom: 24 }}>
            Update your profile and application preferences.
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
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    avatar: null,
    fullName: "",
    email: "",
    phoneNumber: null
  });
  const [startPage, setStartPage] = useState("home");
  const [language, setLanguage] = useState("english");
  const [pdfOpenMode, setPdfOpenMode] = useState("new-card");

  // Fetch profile user from backend
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

  // Gọi fetchProfileUser khi modal mở
  useEffect(() => {
    if (open) {
      fetchProfileUser();
    }
    // eslint-disable-next-line
  }, [open, user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save logic here
      console.log("Saving profile data:", profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <RadixModal open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Profile */}
        <div className="flex-1 min-w-[300px]">
          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-600" />
                    <CardTitle className="text-lg">Profile</CardTitle>
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
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Avatar</Label>
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
                            Upload Image
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Email</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
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
        {/* Right: Other settings */}
        <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
          {/* Start Page Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">Start Page</CardTitle>
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
                  onChange={(e) => setStartPage(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="start-home" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Home
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="start-exam"
                  name="startPage"
                  value="my-exam"
                  checked={startPage === "my-exam"}
                  onChange={(e) => setStartPage(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="start-exam" className="text-sm font-medium text-slate-700 cursor-pointer">
                  My Exam
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="lang-english"
                  name="language"
                  value="english"
                  checked={language === "english"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="lang-english" className="text-sm font-medium text-slate-700 cursor-pointer">
                  English
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="lang-vietnamese"
                  name="language"
                  value="vietnamese"
                  checked={language === "vietnamese"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="lang-vietnamese" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Vietnamese
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* PDF Open Mode Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">Open PDF File</CardTitle>
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
                  New Card
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
                  Preview
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