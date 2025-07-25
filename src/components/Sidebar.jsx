import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  Clock,
  Star,
  Bot,
  AlertTriangle,
  Trash2,
  Plus
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const routeMap = {
  home: '/home',
  myExam: '/myexam',
  recent: '/recently',
  trash: '/trashcan',
  pgvideo: '/pgvideo',
};

const Sidebar = ({ activeKey, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const sidebarItems = [
    { key: 'home', label: t('home'), icon: Home },
    { key: 'myExam', label: t('my_exam'), icon: FileText },
    { key: 'recent', label: t('recently'), icon: Clock },
    { key: 'trash', label: t('trash_can'), icon: Trash2 },
    { key: 'pgvideo', label: 'PGVideo', icon: Bot },
  ];

  const handleNav = (key) => {
    if (key === 'create') {
      if (!user?.isPremium) {
        alert('Bạn cần nâng cấp tài khoản Premium để sử dụng tính năng này!');
        return;
      }
      navigate('/create');
      if (onSelect) onSelect(key);
      return;
    }
    const path = routeMap[key];
    if (path) {
      navigate(path);
    }
    if (onSelect) onSelect(key);
  };

  return (
    <Card className="w-[250px] bg-white dark:bg-[#242526] border-0 shadow-lg dark:shadow-none dark:border-[#3a3b3c]">
      <CardContent className="p-4">
        <div className="space-y-2">

          {/* Chờ khi loading xong mới render button Create */}
          {!loading && (
            <Button
              onClick={() => handleNav('create')}
              className={`w-full justify-start gap-3 h-12 ${
                user?.isPremium
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white font-semibold shadow-lg flex items-center`}
              disabled={!user?.isPremium}
            >
              <Plus className="w-5 h-5" />
              <span>{t('create_new')}</span>
              {!user?.isPremium && (
                <span className="ml-auto text-xs bg-yellow-500 px-2 py-1 rounded-full">Premium Only</span>
              )}
            </Button>
          )}

          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeKey === item.key;
              return (
                <Button
                  key={item.key}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => handleNav(item.key)}
                  className={`w-full justify-start gap-3 h-11
                    ${isActive
                      ? 'bg-[#c2e7ff] text-slate-900 border border-slate-200 pointer-events-none dark:bg-[#3a3b3c] dark:text-white dark:border-[#3a3b3c]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#bab9be] dark:text-white dark:hover:text-white dark:hover:bg-[#3a3b3c]'}
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
