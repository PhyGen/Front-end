import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Share2, 
  Clock, 
  Star, 
  Bot, 
  AlertTriangle, 
  Trash2, 
  Plus,
  BookOpen,
  TrendingUp,
  Users,
  Sparkles
} from "lucide-react";
import HomeBox from './Home';
import { useSidebar } from '../context/SidebarContext';
import CreateTypeSelect from "@/components/CreateTypeSelect";
import MyExam from "./MyExam";
import Recently from "./Recently";
import TrashCan from "./TrashCan";
import SharedWithMe from "./SharedWithMe";

const Placeholder = ({ label, icon, description, color = "blue", children }) => (
  <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-black dark:to-neutral-900 mb-8">
    <CardHeader className="text-center pb-4">
      <div className={`w-16 h-16 bg-${color}-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon && React.createElement(icon, { className: `w-8 h-8 text-${color}-600 dark:text-white` })}
      </div>
      <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">{label}</CardTitle>
      <p className="text-slate-600 dark:text-neutral-200 mt-2">{description}</p>
    </CardHeader>
    <CardContent className="text-center">
      {children}
    </CardContent>
  </Card>
);

const MainScreen = () => {
  const { selectedKey } = useSidebar();
  const { t } = useTranslation();

  let content;
  if (selectedKey === 'create') {
    content = <CreateTypeSelect />;
  } else {
    switch (selectedKey) {
      case 'home':
        content = <HomeBox />;
        break;
      case 'myExam':
        content = (
          <Placeholder 
            label={t('my_exam')} 
            icon={BookOpen} 
            description={t('my_exam_description')}
            color="blue"
          >
            <MyExam />
          </Placeholder>
        );
        break;
      case 'shared':
        content = (
          <Placeholder
            label={t('shared_with_me')}
            icon={Share2}
            description={t('shared_with_me_description')}
            color="green"
          >
            <SharedWithMe />
          </Placeholder>
        );
        break;
      case 'recent':
        content = <Recently />;
        break;
      case 'trash':
        content = <TrashCan />;
        break;
      default:
        content = <HomeBox />;
    }
  }

  return (
    <div className="min-h-[80vh] bg-white dark:bg-[#242526] text-slate-800 dark:text-white rounded-2xl">
      {content}
    </div>
  );
};

export default MainScreen;