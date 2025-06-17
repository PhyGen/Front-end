import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  HelpCircle, 
  Share2,
  BookOpen,
  TrendingUp
} from "lucide-react";

const filterButtons = [
  { label: 'Type', icon: Filter },
  { label: 'Person', icon: User },
  { label: 'Last Modified', icon: Calendar },
  { label: 'Location', icon: MapPin },
];

const suggestedQuestions = [1, 2, 3, 4];
const suggestedExams = [
  { name: 'The Exam', reason: 'You have upload', owner: '', location: 'My Exam' },
  { name: 'The Exam', reason: 'You have opened often', owner: '', location: 'Shared with me' },
  { name: 'The Exam', reason: 'You opened', owner: '', location: 'John' },
  { name: 'The Exam', reason: "Don't opened", owner: '', location: 'Relavant' },
];

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to PhyGen
          </CardTitle>
          <p className="text-slate-600 mt-2">Your intelligent exam management platform</p>
        </CardHeader>
      </Card>

      {/* Search Section */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-80 flex items-center">
              <span className="absolute left-3 inset-y-0 flex items-center">
                <Search className="text-slate-400 w-5 h-5" />
              </span>
              <Input 
                type="text" 
                placeholder="Search for exams, questions, or topics..." 
                className="pl-10 pr-4 py-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button className="ml-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {filterButtons.map(btn => {
              const IconComponent = btn.icon;
              return (
                <Button 
                  key={btn.label} 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-blue-600"
                >
                  <IconComponent className="w-4 h-4" />
                  {btn.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Suggested Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedQuestions.map((_, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">The Question</h3>
                  <Badge variant="secondary" className="text-xs">
                    On shared with me
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Exams */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Suggested Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-slate-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                <div>Name</div>
                <div>Reasons for the proposed document</div>
                <div>Owner</div>
                <div>Location</div>
              </div>
              <div className="divide-y divide-slate-200">
                {suggestedExams.map((exam, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{exam.name}</span>
                    </div>
                    <div className="text-slate-600">{exam.reason}</div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      {exam.location === 'My Exam' && <FileText className="w-4 h-4 text-blue-500" />}
                      {exam.location === 'Shared with me' && <Share2 className="w-4 h-4 text-green-500" />}
                      {exam.location === 'John' && <User className="w-4 h-4 text-purple-500" />}
                      <span className="text-slate-600">{exam.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home; 