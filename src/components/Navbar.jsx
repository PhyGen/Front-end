import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Bell, Settings, Menu, HelpCircle, Moon, AlertCircle, LogOut, Mail, UserCheck } from "lucide-react";
import phygenIcon from '../assets/icons/phygen-icon.png';
import squareMenuIcon from '../assets/icons/square-menu.svg';
import bellDotIcon from '../assets/icons/bell-dot.svg';
import settingIcon from '../assets/icons/setting-icon.png';
import avatarIcon from '../assets/icons/avatar.jpg';
import SettingsModal from './SettingsModal';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/landing');
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 shadow-sm border-b rounded-b-2xl">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={phygenIcon} alt="PhyGen Logo" />
            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="hidden md:flex gap-6">
          <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
            {t('about')}
          </Button>
          <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
            {t('feature')}
          </Button>
          <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
            {t('contact')}
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">
                <Avatar className="h-9 w-9 border-2 border-slate-200">
                  <AvatarImage src={avatarIcon} alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white text-slate-800 border border-slate-200 shadow-xl rounded-xl p-2">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                <Settings className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('settings')}</span>
              </DropdownMenuItem>
                </DropdownMenuSubTrigger>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer w-full">
                  <HelpCircle className="w-6 h-6 text-slate-500" />
                  <span className="flex-1 font-medium text-left">{t('help_and_support')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 bg-white text-slate-800 border border-slate-200 shadow-xl rounded-xl p-2">
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                    <HelpCircle className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('help_center')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                    <UserCheck className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('account_status')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                    <Mail className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('support_inbox')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                    <AlertCircle className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('report_a_problem')}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                <Moon className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('display_and_accessibility')}</span>
                <span className="ml-auto text-slate-400">&gt;</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                <AlertCircle className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('contribute_your_opinion')}</span>
                <span className="text-xs text-slate-400 ml-2">CTRL B</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 my-2" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                <LogOut className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('log_out')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      
      {/* Settings Modal */}
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
};

export default Navbar; 