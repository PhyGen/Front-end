import React, { useState } from 'react';
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
import CreateTypeSelect from "@/components/CreateTypeSelect";
import MyExam from "./MyExam";

const Placeholder = ({ label, icon: Icon, description, color = "blue", children }) => (
  <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 mb-8">
    <CardHeader className="text-center pb-4">
      <div className={`w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
      <CardTitle className="text-2xl font-bold text-slate-800">{label}</CardTitle>
      <p className="text-slate-600 mt-2">{description}</p>
    </CardHeader>
    <CardContent className="text-center">
      {children}
    </CardContent>
  </Card>
);

const MainScreen = () => {
  const { selectedKey, setSelectedKey } = useSidebar();
  const [createType, setCreateType] = useState(null);

  const handleSelectType = (type) => {
    setCreateType(type);
    // Sau khi chọn, bạn có thể điều hướng hoặc hiển thị form tương ứng
    // setSelectedKey('home'); // hoặc chuyển sang trang khác nếu muốn
  };

  let content;
  if (selectedKey === 'create') {
    content = <CreateTypeSelect onSelect={handleSelectType} />;
  } else {
    switch (selectedKey) {
      case 'home':
        content = <HomeBox />;
        break;
      case 'myExam':
        content = (
          <Placeholder 
            label="My Exam" 
            icon={BookOpen} 
            description="Manage and organize your personal exam collection"
            color="blue"
          >
            <MyExam />
          </Placeholder>
        );
        break;
      case 'shared':
        content = (
          <Placeholder
            label="Shared with me"
            icon={Share2}
            description="Access exams shared by other users"
            color="green"
          >
            {/* Nội dung động cho Shared with me */}
          </Placeholder>
        );
        break;
      case 'recent':
        content = (
          <Placeholder
            label="Recently"
            icon={Clock}
            description="Quick access to your recently viewed content"
            color="purple"
          >
            {/* Nội dung động cho Recently */}
          </Placeholder>
        );
        break;
      case 'starred':
        content = (
          <Placeholder
            label="Starred"
            icon={Star}
            description="Your favorite and bookmarked content"
            color="yellow"
          >
            {/* Nội dung động cho Starred */}
          </Placeholder>
        );
        break;
      case 'ai':
        content = (
          <Placeholder
            label="AI Generate"
            icon={Bot}
            description="Create exams and questions using AI assistance"
            color="indigo"
          >
            {/* Nội dung động cho AI Generate */}
          </Placeholder>
        );
        break;
      case 'spam':
        content = (
          <Placeholder
            label="Spam Content"
            icon={AlertTriangle}
            description="Review and manage flagged content"
            color="red"
          >
            {/* Nội dung động cho Spam Content */}
          </Placeholder>
        );
        break;
      case 'trash':
        content = (
          <Placeholder
            label="Trash Can"
            icon={Trash2}
            description="Recover or permanently delete items"
            color="gray"
          >
            {/* Nội dung động cho Trash Can */}
          </Placeholder>
        );
        break;
      default:
        content = <HomeBox />;
    }
  }

  return (
    <div className="min-h-[80vh]">
      {content}
    </div>
  );
};

export default MainScreen;
