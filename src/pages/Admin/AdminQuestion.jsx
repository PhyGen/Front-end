import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import StatusNotFound from '@/assets/icons/status-notfound-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';
import api from '../../config/axios';

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const pageSizeOptions = [3, 5, 7, 10];
const difficultyLevels = [
  { value: 'all', label: 'Tất cả độ khó' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

const AdminQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [pendingSort, setPendingSort] = useState('createdAt:desc');
  const [lessonId, setLessonId] = useState('all');
  const [pendingLessonId, setPendingLessonId] = useState('all');
  const [chapterId, setChapterId] = useState('all');
  const [pendingChapterId, setPendingChapterId] = useState('all');
  const [difficultyLevel, setDifficultyLevel] = useState('all');
  const [pendingDifficultyLevel, setPendingDifficultyLevel] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch lessons and chapters for filter
  useEffect(() => {
    api.get('/lessons').then(res => setLessons(res.data.items || []));
    api.get('/chapters').then(res => setChapters(res.data || []));
  }, []);

  // Fetch questions from API
  const fetchQuestions = () => {
    setLoading(true);
    api.get('/questions', {
      params: {
        search,
        sort,
        isSort: 1,
        lessonId: lessonId !== 'all' ? lessonId : undefined,
        chapterId: chapterId !== 'all' ? chapterId : undefined,
        difficultyLevel: difficultyLevel !== 'all' ? difficultyLevel : undefined,
        pageNumber: page,
        pageSize,
      }
    })
      .then(res => {
        setQuestions(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      })
      .catch(() => {
        setQuestions([]);
        setTotalPages(1);
        setTotalItems(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, pageSize, search, sort, lessonId, chapterId, difficultyLevel]);

  const handleSearch = () => {
    setSearch(pendingSearch);
    setLessonId(pendingLessonId);
    setChapterId(pendingChapterId);
    setSort(pendingSort);
    setDifficultyLevel(pendingDifficultyLevel);
    setPage(1);
  };

  const handleReset = () => {
    setSearch(''); setPendingSearch('');
    setSort('createdAt:desc'); setPendingSort('createdAt:desc');
    setLessonId('all'); setPendingLessonId('all');
    setChapterId('all'); setPendingChapterId('all');
    setDifficultyLevel('all'); setPendingDifficultyLevel('all');
    setPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <Input
            value={pendingSearch}
            onChange={e => setPendingSearch(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi..."
            className="w-64"
          />
          <Select value={pendingLessonId} onValueChange={v => setPendingLessonId(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Lọc theo bài học" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bài học</SelectItem>
              {lessons.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={pendingChapterId} onValueChange={v => setPendingChapterId(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Lọc theo chương" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chương</SelectItem>
              {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={pendingDifficultyLevel} onValueChange={v => setPendingDifficultyLevel(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Lọc theo độ khó" /></SelectTrigger>
            <SelectContent>
              {difficultyLevels.map(dl => <SelectItem key={dl.value} value={dl.value}>{dl.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={pendingSort} onValueChange={v => setPendingSort(v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Sắp xếp" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Mới nhất</SelectItem>
              <SelectItem value="createdAt:asc">Cũ nhất</SelectItem>
              <SelectItem value="content:asc">Câu hỏi A-Z</SelectItem>
              <SelectItem value="content:desc">Câu hỏi Z-A</SelectItem>
              <SelectItem value="difficultyLevel:asc">Độ khó tăng dần</SelectItem>
              <SelectItem value="difficultyLevel:desc">Độ khó giảm dần</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Tìm kiếm
          </Button>
          <Button onClick={handleReset} variant="outline">
            Đặt lại
          </Button>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-slate-600">Tổng số câu hỏi: {totalItems}</span>
          <Select value={pageSize.toString()} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>{size} / trang</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto min-h-[120px]">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <img src={loadingGif} alt="loading" className="w-10 h-10" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <img src={StatusNotFound} alt="not found" className="w-16 h-16 mb-2 opacity-80" />
              <span className="text-red-600 font-semibold text-lg">Question not found</span>
            </div>
          ) : (
            <table className="min-w-[900px] w-full border border-slate-200 rounded-lg bg-white shadow-sm text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="px-4 py-2 border-b">Id</th>
                  <th className="px-4 py-2 border-b">Question</th>
                  <th className="px-4 py-2 border-b">Lesson</th>
                  <th className="px-4 py-2 border-b">Chapter</th>
                  <th className="px-4 py-2 border-b">Difficulty</th>
                  <th className="px-4 py-2 border-b">Created By</th>
                  <th className="px-4 py-2 border-b">Create At</th>
                  <th className="px-4 py-2 border-b">UpdatedAt</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(row => (
                  <tr key={row.id} className="even:bg-slate-50">
                    <td className="px-4 py-2 border-b text-center">{row.id}</td>
                    <td className="px-4 py-2 border-b">{row.content}</td>
                    <td className="px-4 py-2 border-b">{row.lessonName}</td>
                    <td className="px-4 py-2 border-b">{row.chapterId}</td>
                    <td className="px-4 py-2 border-b">{row.difficultyLevel}</td>
                    <td className="px-4 py-2 border-b">{row.createdByUserName}</td>
                    <td className="px-4 py-2 border-b">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-2 border-b">{formatDate(row.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuestion; 