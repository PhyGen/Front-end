import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileText, 
  Share2, 
  Clock, 
  Star, 
  Bot, 
  AlertTriangle, 
  Trash2, 
  Plus 
} from "lucide-react";
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activeKey, onSelect }) => {
  const { t } = useTranslation();

  const sidebarItems = [
    { key: 'home', label: t('home'), icon: Home },
    { key: 'myExam', label: t('my_exam'), icon: FileText },
    { key: 'shared', label: t('shared_with_me'), icon: Share2 },
    { key: 'recent', label: t('recently'), icon: Clock },
    { key: 'trash', label: t('trash_can'), icon: Trash2 },
  ];

  return (
    <Card className="w-[250px] bg-white dark:bg-[#242526] border-0 shadow-lg dark:shadow-none dark:border-[#3a3b3c]">
      <CardContent className="p-4">
        <div className="space-y-2">
          <Button 
            onClick={() => onSelect('create')}
            className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{t('create_new')}</span>
          </Button>
          
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeKey === item.key;
              return (
                <Button
                  key={item.key}
                  variant={activeKey === item.key ? "secondary" : "ghost"}
                  onClick={() => onSelect(item.key)}
                  className={`w-full justify-start gap-3 h-11
                    ${activeKey === item.key
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