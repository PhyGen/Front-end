import React from 'react';
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
import HomeBox from '../components/Home';
import { useSidebar } from '../context/SidebarContext';

const Placeholder = ({ label, icon: Icon, description, color = "blue" }) => (
  <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
    <CardHeader className="text-center pb-4">
      <div className={`w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
      <CardTitle className="text-2xl font-bold text-slate-800">{label}</CardTitle>
      <p className="text-slate-600 mt-2">{description}</p>
    </CardHeader>
    <CardContent className="text-center">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-slate-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Coming Soon</p>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">New Features</p>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Collaboration</p>
            </div>
          </Card>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Get Started
        </Button>
      </div>
    </CardContent>
  </Card>
);

const MainScreen = () => {
  const { selectedKey } = useSidebar();

  let content;
  switch (selectedKey) {
    case 'home':
      content = <HomeBox />;
      break;
    case 'myExam':
      content = <Placeholder 
        label="My Exam" 
        icon={BookOpen} 
        description="Manage and organize your personal exam collection"
        color="blue"
      />;
      break;
    case 'shared':
      content = <Placeholder 
        label="Shared with me" 
        icon={Share2} 
        description="Access exams shared by other users"
        color="green"
      />;
      break;
    case 'recent':
      content = <Placeholder 
        label="Recently" 
        icon={Clock} 
        description="Quick access to your recently viewed content"
        color="purple"
      />;
      break;
    case 'starred':
      content = <Placeholder 
        label="Starred" 
        icon={Star} 
        description="Your favorite and bookmarked content"
        color="yellow"
      />;
      break;
    case 'ai':
      content = <Placeholder 
        label="AI Generate" 
        icon={Bot} 
        description="Create exams and questions using AI assistance"
        color="indigo"
      />;
      break;
    case 'spam':
      content = <Placeholder 
        label="Spam Content" 
        icon={AlertTriangle} 
        description="Review and manage flagged content"
        color="red"
      />;
      break;
    case 'trash':
      content = <Placeholder 
        label="Trash Can" 
        icon={Trash2} 
        description="Recover or permanently delete items"
        color="gray"
      />;
      break;
    case 'create':
      content = <Placeholder 
        label="Create New" 
        icon={Plus} 
        description="Start creating new exams and questions"
        color="emerald"
      />;
      break;
    default:
      content = <HomeBox />;
  }

  return (
    <div className="min-h-[80vh]">
      {content}
    </div>
  );
};

export default MainScreen;
