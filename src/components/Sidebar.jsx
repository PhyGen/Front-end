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

const sidebarItems = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'myExam', label: 'My Exam', icon: FileText },
  { key: 'shared', label: 'Shared with me', icon: Share2 },
  { key: 'recent', label: 'Recently', icon: Clock },
  { key: 'starred', label: 'Starred', icon: Star },
  { key: 'ai', label: 'AI generate', icon: Bot },
  { key: 'spam', label: 'Spam Content', icon: AlertTriangle },
  { key: 'trash', label: 'Trash Can', icon: Trash2 },
];

const Sidebar = ({ activeKey, onSelect }) => {
  return (
    <Card className="w-[250px] bg-white/80 backdrop-blur border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-2">
          <Button 
            onClick={() => onSelect('create')}
            className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </Button>
          
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={activeKey === item.key ? "secondary" : "ghost"}
                  onClick={() => onSelect(item.key)}
                  className={`w-full justify-start gap-3 h-11 ${
                    activeKey === item.key 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.key === 'myExam' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      3
                    </Badge>
                  )}
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