import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Bell, Settings, HelpCircle, Moon, AlertCircle, LogOut, Mail, UserCheck } from "lucide-react";
import phygenIcon from '../assets/icons/phygen-icon.png';
import avatarIcon from '../assets/icons/avatar.jpg';
import SettingsModal from '../components/SettingsModal';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import DisplaySettings from '../components/DisplaySettings';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import ContributeModal from '../components/ContributeModal';

const Header = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    setUser(null);
    navigate('/landing');
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    setIsDisplayOpen(false);
    setIsContributeOpen(false);
  };

  const handleDisplayClick = () => {
    setIsDisplayOpen(true);
    setIsSettingsOpen(false);
    setIsContributeOpen(false);
  };

  const handleContributeClick = () => {
    setIsContributeOpen(true);
    setIsSettingsOpen(false);
    setIsDisplayOpen(false);
  };

  return (
    <>
          <header className="
  flex items-center justify-between
  bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60
  dark:bg-[#242526] dark:backdrop-blur dark:supports-[backdrop-filter]:dark:bg-[#242526]/80
  p-4 shadow-sm border-b border-slate-200 dark:border-[#3a3b3c]
  rounded-b-2xl
">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={phygenIcon} alt="PhyGen Logo" />
            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
        </div>
        {/*Mid side - Navbar */}
        <Navbar onSettingsClick={handleSettingsClick} />
        {/* Right side - Bell and User Avatar */}
        <div className="flex items-center gap-3">
          {/* Bell Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">
                <Avatar className="h-9 w-9 border-2 border-slate-200">
                  <AvatarImage src={avatarIcon} alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white text-slate-800 border border-slate-200 shadow-xl rounded-xl p-2 dark:bg-[#23272f] dark:text-white dark:border-[#3a3b3c]">
              <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                <Settings className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer w-full dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                  <HelpCircle className="w-6 h-6 text-slate-500" />
                  <span className="flex-1 font-medium text-left">{t('help_and_support')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 bg-white text-slate-800 border border-slate-200 shadow-xl rounded-xl p-2 dark:bg-[#23272f] dark:text-white dark:border-[#3a3b3c]">
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                    <HelpCircle className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('help_center')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                    <UserCheck className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('account_status')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                    <Mail className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('support_inbox')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                    <AlertCircle className="w-6 h-6 text-slate-500" />
                    <span className="flex-1 font-medium">{t('report_a_problem')}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleDisplayClick} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white" >
                <Moon className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('display_and_accessibility')}</span>
                <span className="ml-auto text-slate-400">&gt;</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleContributeClick} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                <AlertCircle className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('contribute_your_opinion')}</span>
                <span className="text-xs text-slate-400 ml-2">CTRL B</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 my-2" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer dark:hover:bg-[#35373b] dark:focus:bg-[#35373b] dark:text-white">
                <LogOut className="w-6 h-6 text-slate-500" />
                <span className="flex-1 font-medium">{t('log_out')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      {/* Settings Modal */}
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
      />
      {/* Display & Accessibility Modal */}
      <Dialog open={isDisplayOpen} onOpenChange={setIsDisplayOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30 z-50" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl w-[400px] max-w-[95vw] z-50 border dark:border-neutral-800 p-6">
            <DisplaySettings />
            {/* <DialogClose asChild>
              <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800">
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DialogClose> */}
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <ContributeModal open={isContributeOpen} onOpenChange={setIsContributeOpen} />
    </>
  );
};

export default Header;
