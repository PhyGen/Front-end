import React, { useState, useEffect, useRef } from 'react';
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
import api from '@/config/axios';

const Home = () => {
  const { t } = useTranslation();

  // Filter states
  const [type, setType] = React.useState('all');
  const [person, setPerson] = React.useState('');
  const [personHistory, setPersonHistory] = React.useState([]);
  const [lastModified, setLastModified] = React.useState('today');
  const [customRange, setCustomRange] = React.useState({ from: '', to: '' });
  const [location, setLocation] = React.useState('anywhere');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  // Lấy userId từ localStorage hoặc context
  const userId = (() => {
    // Nếu dùng AuthContext thì lấy từ context, ví dụ:
    // const { user } = useContext(AuthContext);
    // return user?.id;
    // Nếu lưu ở localStorage:
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return userObj?.id;
      }
    } catch {}
    return 3; // fallback nếu không có, demo lấy id=3
  })();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await api.get('/questions?pageSize=10&isSort=1&sort=createdAt:desc');
        setQuestions(response.data.items ? response.data.items.slice(0, 10) : []);
      } catch (error) {
        console.error("Failed to fetch recent questions:", error);
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // Fetch 4 newest exams for suggested exams (by user)
  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const response = await api.get(`/exams/user/${userId}`);
        // Lấy 4 exam mới nhất, sort theo createdAt desc
        const sorted = (response.data || [])
          .filter(e => !e.isDeleted)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setExams(sorted);
      } catch (error) {
        setExams([]);
      } finally {
        setLoadingExams(false);
      }
    };
    if (userId) fetchExams();
  }, [userId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || loadingQuestions || questions.length === 0) return;

    let intervalId;

    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (scrollContainer) {
          const scrollAmount = scrollContainer.firstElementChild.offsetWidth + 24; // Card width + space-x-6 (1.5rem = 24px)
          const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

          if (isAtEnd) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 2000); // Cuộn mỗi 2 giây
    };

    const stopScrolling = () => {
      clearInterval(intervalId);
    };

    startScrolling();
    scrollContainer.addEventListener('mouseenter', stopScrolling);
    scrollContainer.addEventListener('mouseleave', startScrolling);

    return () => {
      clearInterval(intervalId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', stopScrolling);
        scrollContainer.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, [loadingQuestions, questions]);

  // Handler for person search
  const handlePersonSearch = (e) => {
    setPerson(e.target.value);
    if (e.target.value && !personHistory.includes(e.target.value)) {
      setPersonHistory((prev) => [e.target.value, ...prev.slice(0, 2)]);
    }
  };

  // Handler for search bar (search exams and questions)
  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      // 1. Lấy tất cả exams của user, lọc trên frontend
      const examsRes = await api.get(`/exams/user/${userId}`);
      const userExams = (examsRes.data || [])
        .filter(e => !e.isDeleted && (
          !searchValue || (e.name && e.name.toLowerCase().includes(searchValue.toLowerCase()))
        ))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8)
        .map(item => ({ ...item, type: 'exam' }));

      // 2. Lấy questions trong kho dữ liệu (nếu muốn chỉ lấy của mình thì thêm createdByUserId)
      const questionsRes = await api.get('/questions', {
        params: {
          search: searchValue,
          pageSize: 8,
          isSort: 1,
          sort: 'createdAt:desc',
          // Nếu muốn chỉ lấy câu hỏi của mình thì mở dòng dưới:
          // createdByUserId: userId,
        },
      });
      const questions = (questionsRes.data.items || []).map(item => ({ ...item, type: 'question' }));

      setSearchResults([
        ...userExams,
        ...questions,
      ]);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
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
          {personHistory.slice(0, 3).map((email) => (
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
        <div className="border rounded-md p-3 bg-white dark:bg-[#242526] dark:border-[#3a3b3c] shadow-sm flex flex-col gap-2">
        <label className="text-xs text-slate-500 dark:text-slate-400">{t('from')}</label>
        <Input
  type="date"
  value={customRange.from}
  onChange={e => handleCustomRangeChange('from', e.target.value)}
  className={`bg-white dark:bg-white dark:text-black border-slate-300 dark:border-[#3a3b3c] ${
    !isCustomRangeValid && customRange.from && customRange.to
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : ''
  }`}
/>
          <label className="text-xs text-slate-500">{t('to')}</label>
          <Input
  type="date"
  value={customRange.to}
  onChange={e => handleCustomRangeChange('to', e.target.value)}
  className={`bg-white dark:bg-white dark:text-black border-slate-300 dark:border-[#3a3b3c] ${
    !isCustomRangeValid && customRange.from && customRange.to
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : ''
  }`}
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

  // Remove static suggestedExams, use exams from API

  const getDifficultyClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard':
        return 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-400 text-gray-500 bg-gray-50 dark:bg-gray-700/20';
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-100 dark:bg-[#242526] min-h-screen">
      {/* Header */}
      <Card className="bg-blue-50 dark:bg-[#242526] border border-slate-200 dark:border-[#3a3b3c] shadow-lg rounded-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:bg-none dark:text-[#e4e6eb]">
            {t('home_welcome_title')}
          </CardTitle>
          <p className="text-slate-600 dark:text-[#b0b3b8] mt-2">{t('home_welcome_subtitle')}</p>
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
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={t('home_search_placeholder')} 
                className="pl-10 pr-4 py-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button className="ml-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" onClick={handleSearch} disabled={loadingSearch}>
              {loadingSearch ? t('searching') : t('search')}
            </Button>
          </div>
          {filterDropdowns}
          {/* Search Results */}
          {searchValue && (
            <div className="mt-6">
              <div className="font-semibold mb-2">{t('search_results')}</div>
              {loadingSearch ? (
                <div className="text-center text-slate-500">{t('loading')}...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center text-slate-500">{t('no_results_found')}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((item, idx) => (
                    <Card key={item.id || idx} className="p-4 flex flex-col gap-2 border-slate-200 dark:border-[#18191a] bg-white dark:bg-[#18191a]">
                      <div className="flex items-center gap-2">
                        {item.type === 'exam' ? <FileText className="w-5 h-5 text-blue-500" /> : <HelpCircle className="w-5 h-5 text-blue-500" />}
                        <span className="font-semibold">{item.name || item.content}</span>
                      </div>
                      <div className="text-xs text-slate-500">{item.type === 'exam' ? 'Exam' : 'Question'}</div>
                      {item.type === 'exam' && (
                        <div className="text-xs text-slate-400">Location: {item.location || item.ownerName || 'Unknown'}</div>
                      )}
                      {item.type === 'question' && (
                        <div className="text-xs text-slate-400">Nguồn: {item.questionSource || 'Không rõ'}</div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card className="shadow-md bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3a3b3c] rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-[#e4e6eb]">
            <TrendingUp className="w-5 h-5 text-blue-500 dark:text-[#60a5fa]" />
            {t('Suggested Questions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto py-2">
            {loadingQuestions ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <Card key={idx} className="w-80 h-48 rounded-2xl flex-shrink-0">
                     <div className="p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
                     </div>
                  </Card>
                ))
            ) : questions.length > 0 ? (
              questions.map((question) => (
                <Card key={question.id} className="w-80 hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-[#18191a] bg-white dark:bg-[#18191a] flex flex-col justify-between flex-shrink-0">
                  <CardContent className="p-4 text-center flex flex-col justify-between flex-grow">
                    <div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-[#242526] rounded-full flex items-center justify-center mx-auto mb-3">
                        <HelpCircle className="w-6 h-6 text-blue-600 dark:text-[#e4e6eb]" />
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-[#e4e6eb] mb-1 text-sm min-h-[3.5rem] line-clamp-3" title={question.content}>
                        {question.content}
                      </h3>
                      <p className="text-xs text-slate-400">ID: {question.id}</p>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs text-blue-600 dark:text-[#60a5fa] bg-blue-100 dark:bg-[#1e293b] w-full block text-left truncate p-2" title={question.questionSource}>
                        Nguồn: {question.questionSource || 'Không rõ'}
                      </Badge>
                      <Badge variant="outline" className={`text-xs mt-1 w-full block text-left truncate p-2 ${getDifficultyClass(question.difficultyLevel)}`}>
                        Độ khó: {question.difficultyLevel || 'Không rõ'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
                <p className="w-full text-center text-slate-500 dark:text-gray-400 py-10">Không tìm thấy câu hỏi gợi ý nào.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Exams */}
      <Card className="shadow-md bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3a3b3c] rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-white">
            <BookOpen className="w-5 h-5 text-blue-500 dark:text-[#60a5fa]" />
            Suggested Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-slate-50 dark:bg-[#18191a] rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                <div>{t('home_exam_table_name')}</div>
                <div>{t('home_exam_table_reason')}</div>
                <div>{t('home_exam_table_owner')}</div>
                <div>{t('home_exam_table_location')}</div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-[#3a3b3c]">
                {loadingExams ? (
                  <div className="text-center py-8 text-slate-500">{t('loading')}...</div>
                ) : exams.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">{t('no_exams_found')}</div>
                ) : (
                  exams.map((exam, idx) => (
                    <div key={exam.id || idx} className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50 dark:hover:bg-[#242526] transition-colors text-slate-800 dark:text-[#e4e6eb]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        <span className="font-medium">{exam.name}</span>
                      </div>
                      <div className="text-slate-600 dark:text-[#b0b3b8]">{exam.reason || exam.description || 'No reason'}</div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 dark:text-[#e4e6eb]" />
                        <span>{exam.ownerName || exam.createdByUserName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {exam.location === 'My Exam' && <FileText className="w-4 h-4 text-blue-500" />}
                        {exam.location === 'Shared with me' && <Share2 className="w-4 h-4 text-green-500" />}
                        {exam.location === 'John' && <User className="w-4 h-4 text-purple-500" />}
                        <span className="text-slate-600">{exam.location || exam.ownerName || 'Relevant'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;