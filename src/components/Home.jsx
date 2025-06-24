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
  TrendingUp,
  Star,
  Trash2
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import  {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import wordIcon from '@/assets/icons/word-icon.svg';
import folderIcon from '@/assets/icons/house.svg';
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '@/components/ui/popover';

const Home = () => {
  const { t } = useTranslation();

  // Filter states
  const [type, setType] = React.useState('all');
  const [person, setPerson] = React.useState('');
  const [personHistory, setPersonHistory] = React.useState([]);
  const [lastModified, setLastModified] = React.useState('today');
  const [customRange, setCustomRange] = React.useState({ from: '', to: '' });
  const [location, setLocation] = React.useState('anywhere');

  // Handler for person search
  const handlePersonSearch = (e) => {
    setPerson(e.target.value);
    if (e.target.value && !personHistory.includes(e.target.value)) {
      setPersonHistory((prev) => [e.target.value, ...prev.slice(0, 2)]);
    }
  };

  // Handler for custom date range
  const handleCustomRangeChange = (field, value) => {
    setCustomRange((prev) => ({ ...prev, [field]: value }));
  };
  const isCustomRangeValid = customRange.from && customRange.to && customRange.from <= customRange.to;

  // Filter dropdowns
  const filterDropdowns = (
    <div className="flex justify-center gap-3 mb-6 flex-wrap">
      {/* Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
            <Filter className="w-4 h-4" />
            {t('filter_type')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={type} onValueChange={setType}>
            <DropdownMenuRadioItem value="all">
              <img src={folderIcon} alt="Folder" className="w-5 h-5 mr-2 inline-block" />
              {t('folder')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="word">
              <img src={wordIcon} alt="Word" className="w-5 h-5 mr-2 inline-block" />
              {t('word')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pdf">
              <img src={pdfIcon} alt="PDF" className="w-5 h-5 mr-2 inline-block" />
              {t('pdf')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Person Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
            <User className="w-4 h-4" />
            {t('filter_person')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>{t('search_email')}</DropdownMenuLabel>
          <div className="px-2 py-1">
            <Input
              type="email"
              placeholder={t('enter_email')}
              value={person}
              onChange={handlePersonSearch}
              className="w-full"
            />
          </div>
          {personHistory.length > 0 && <DropdownMenuSeparator />}
          {personHistory.slice(0, 3).map((email, idx) => (
            <DropdownMenuItem key={email} onClick={() => setPerson(email)}>
              <User className="w-4 h-4 mr-2" />
              {email}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

{/* Last Modified Dropdown */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="flex items-center gap-2 min-w-[160px]">
      <Calendar className="w-4 h-4" />
      {t('filter_last_modified')}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioGroup value={lastModified} onValueChange={setLastModified}>
      <DropdownMenuRadioItem value="today">{t('today')}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="last7">{t('last_7_days')}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="last30">{t('last_30_days')}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="this_year">
        {t('this_year', { year: new Date().getFullYear() })}
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="last_year">
        {t('last_year', { year: new Date().getFullYear() - 1 })}
      </DropdownMenuRadioItem>

      <DropdownMenuRadioItem
    value="custom"
    onSelect={(e) => {
    e.preventDefault();         
    setLastModified('custom'); 
    }}
    >
  {t('custom_date_range')}
</DropdownMenuRadioItem>

    </DropdownMenuRadioGroup>

    {/* Custom Range Popover (hiện ra khi chọn custom) */}
    {lastModified === 'custom' && (
      <div className="px-4 pt-2 pb-3">
        <div className="border rounded-md p-3 bg-white shadow-sm flex flex-col gap-2">
          <label className="text-xs text-slate-500">{t('from')}</label>
          <Input
            type="date"
            value={customRange.from}
            onChange={e => handleCustomRangeChange('from', e.target.value)}
            className={!isCustomRangeValid && customRange.from && customRange.to ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
          <label className="text-xs text-slate-500">{t('to')}</label>
          <Input
            type="date"
            value={customRange.to}
            onChange={e => handleCustomRangeChange('to', e.target.value)}
            className={!isCustomRangeValid && customRange.from && customRange.to ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
          {!isCustomRangeValid && customRange.from && customRange.to && (
            <p className="text-xs text-red-500 mt-1">{t('invalid_date_range')}</p>
          )}
          <div className="flex justify-between mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCustomRange({ from: '', to: '' })}
              disabled={!customRange.from && !customRange.to}
            >
              {t('clear_all')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!isCustomRangeValid}
              onClick={() => setLastModified('custom')}
            >
              {t('apply')}
            </Button>
          </div>
        </div>
      </div>
    )}
  </DropdownMenuContent>
</DropdownMenu>


      {/* Location Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[180px]">
            <MapPin className="w-4 h-4" />
            {t('filter_location')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={location} onValueChange={setLocation}>
            <DropdownMenuRadioItem value="anywhere">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              {t('anywhere_in_phygen')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="my_exam">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              {t('my_exam')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="shared">
              <Share2 className="w-4 h-4 mr-2 text-green-500" />
              {t('shared_with_me')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="starred">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {t('starred')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="trash">
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              {t('move_to_trash')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const suggestedQuestions = [1, 2, 3, 4];
  const suggestedExams = [
    { name: t('exam_name_sample'), reason: t('exam_reason_upload'), owner: '', location: t('my_exam') },
    { name: t('exam_name_sample'), reason: t('exam_reason_opened_often'), owner: '', location: t('shared_with_me') },
    { name: t('exam_name_sample'), reason: t('exam_reason_opened'), owner: '', location: 'John' },
    { name: t('exam_name_sample'), reason: t('exam_reason_not_opened'), owner: '', location: t('exam_location_relevant') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('home_welcome_title')}
          </CardTitle>
          <p className="text-slate-600 mt-2">{t('home_welcome_subtitle')}</p>
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
                placeholder={t('home_search_placeholder')} 
                className="pl-10 pr-4 py-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button className="ml-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              {t('search')}
            </Button>
          </div>
          
          {filterDropdowns}
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {t('home_suggested_questions')}
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
                  <h3 className="font-semibold text-slate-800 mb-1">{t('home_question_sample')}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {t('home_on_shared_with_me')}
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
            {t('home_suggested_exams')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-slate-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                <div>{t('home_exam_table_name')}</div>
                <div>{t('home_exam_table_reason')}</div>
                <div>{t('home_exam_table_owner')}</div>
                <div>{t('home_exam_table_location')}</div>
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
                      {exam.location === t('my_exam') && <FileText className="w-4 h-4 text-blue-500" />}
                      {exam.location === t('shared_with_me') && <Share2 className="w-4 h-4 text-green-500" />}
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