import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Bell, Settings, Menu, HelpCircle, Moon, AlertCircle, LogOut } from "lucide-react";
import phygenIcon from '../assets/icons/phygen-icon.png';
import squareMenuIcon from '../assets/icons/square-menu.svg';
import bellDotIcon from '../assets/icons/bell-dot.svg';
import settingIcon from '../assets/icons/setting-icon.png';
import avatarIcon from '../assets/icons/avatar.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/landing');
  };

  return (
    <nav className="flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 shadow-sm border-b rounded-b-2xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={phygenIcon} alt="PhyGen Logo" />
          <AvatarFallback>PG</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
          <img src={squareMenuIcon} alt="Menu" className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="hidden md:flex gap-6">
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium">
          About
        </Button>
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium">
          Feature
        </Button>
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium">
          Contact
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
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
            <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
              <HelpCircle className="w-6 h-6 text-slate-500" />
              <span className="flex-1 font-medium">Help and support</span>
              <span className="ml-auto text-slate-400">&gt;</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
              <Moon className="w-6 h-6 text-slate-500" />
              <span className="flex-1 font-medium">Display & Accessibility</span>
              <span className="ml-auto text-slate-400">&gt;</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
              <AlertCircle className="w-6 h-6 text-slate-500" />
              <span className="flex-1 font-medium">Contribute your opinion</span>
              <span className="text-xs text-slate-400 ml-2">CTRL B</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 my-2" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
              <LogOut className="w-6 h-6 text-slate-500" />
              <span className="flex-1 font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar; 