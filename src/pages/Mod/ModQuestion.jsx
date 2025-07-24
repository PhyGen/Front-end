import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

const ModQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [solutions, setSolutions] = useState([]);
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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    questionId: null,
    content: '',
    difficultyLevel: 'easy',
    solutionId: null,
    solutionContent: '',
    solutionExplanation: ''
  });

  useEffect(() => {
    api.get('/lessons').then(res => setLessons(res.data.items || []));
    api.get('/chapters').then(res => setChapters(res.data || []));
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    api.get('/questions', {
      params: { search, sort, isSort: 1, lessonId: lessonId !== 'all' ? lessonId : undefined, chapterId: chapterId !== 'all' ? chapterId : undefined, difficultyLevel: difficultyLevel !== 'all' ? difficultyLevel : undefined, pageNumber: page, pageSize }
    })
    .then(res => { const filteredItems = (res.data.items || []).filter(item => item.id >= 0);
      setQuestions(filteredItems); 
      setTotalPages(res.data.totalPages || 1); 
      setTotalItems(res.data.totalItems || 0); })
    .catch(() => setQuestions([]))
    .finally(() => setLoading(false));
  };

  const fetchSolutions = async () => {
    try { const res = await api.get('/solutions'); setSolutions(res.data || []); } catch { setSolutions([]); }
  };

  useEffect(() => { fetchQuestions(); fetchSolutions(); }, [page, pageSize, search, sort, lessonId, chapterId, difficultyLevel]);

  const handleSearch = () => { setSearch(pendingSearch); setLessonId(pendingLessonId); setChapterId(pendingChapterId); setSort(pendingSort); setDifficultyLevel(pendingDifficultyLevel); setPage(1); };
  const handleReset = () => { setSearch(''); setPendingSearch(''); setSort('createdAt:desc'); setPendingSort('createdAt:desc'); setLessonId('all'); setPendingLessonId('all'); setChapterId('all'); setPendingChapterId('all'); setDifficultyLevel('all'); setPendingDifficultyLevel('all'); setPage(1); };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await api.delete(`/questions/${questionId}`);
      const sol = solutions.find(s => s.questionId === questionId);
      if (sol) await api.delete(`/solutions/${sol.id}`);
      fetchQuestions(); fetchSolutions();
    } catch { alert('Xóa thất bại'); }
  };

  const handleEdit = (row) => {
    const sol = solutions.find(s => s.questionId === row.id) || {};
    setEditData({ questionId: row.id, content: row.content, difficultyLevel: row.difficultyLevel, solutionId: sol.id || null, solutionContent: sol.content || '', solutionExplanation: sol.explanation || '' });
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/questions/${editData.questionId}`, { id: editData.questionId, content: editData.content, difficultyLevel: editData.difficultyLevel });
      if (editData.solutionId) await api.put(`/solutions/${editData.solutionId}`, { id: editData.solutionId, content: editData.solutionContent, explanation: editData.solutionExplanation });
      setIsEditOpen(false); 
      fetchQuestions(); 
      fetchSolutions();
    } catch { alert('Cập nhật thất bại'); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Question Management</CardTitle></CardHeader>
      <CardContent>
        {/* Filters & search UI (unchanged) */}
        {/* Table & pagination UI (unchanged) */}
        <div className="overflow-x-auto min-h-[120px]">
          {loading ? (
            <div className="flex justify-center items-center h-24"><img src={loadingGif} alt="loading" className="w-10 h-10" /></div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8"><img src={StatusNotFound} alt="not found" className="w-16 h-16 mb-2 opacity-80" /><span className="text-red-600 font-semibold text-lg">Question not found</span></div>
          ) : (
            <table className="min-w-[900px] w-full border border-slate-200 rounded-lg bg-white shadow-sm text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="px-4 py-2 border-b">Id</th>
                  <th className="px-4 py-2 border-b">Question</th>
                  <th className="px-4 py-2 border-b">Solution</th>
                  <th className="px-4 py-2 border-b">Explanation</th>
                  <th className="px-4 py-2 border-b">Lesson</th>
                  <th className="px-4 py-2 border-b">Chapter</th>
                  <th className="px-4 py-2 border-b">Difficulty</th>
                  <th className="px-4 py-2 border-b">Created By</th>
                  <th className="px-4 py-2 border-b">Created At</th>
                  <th className="px-4 py-2 border-b">Updated At</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(row => {
                  const matchedSolution = solutions.find(s => s.questionId === row.id);
                  return (
                    <tr key={row.id} className="even:bg-slate-50">
                      <td className="px-4 py-2 border-b text-center">{row.id}</td>
                      <td className="px-4 py-2 border-b">{row.content}</td>
                      <td className="px-4 py-2 border-b">{matchedSolution?.content || '-'}</td>
                      <td className="px-4 py-2 border-b">{matchedSolution?.explanation || '-'}</td>
                      <td className="px-4 py-2 border-b">{row.lessonName}</td>
                      <td className="px-4 py-2 border-b">{row.chapterName}</td>
                      <td className="px-4 py-2 border-b">{row.difficultyLevel}</td>
                      <td className="px-4 py-2 border-b">{row.createdByUserName}</td>
                      <td className="px-4 py-2 border-b">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2 border-б">{formatDate(row.updatedAt)}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(row)}>Edit</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(row.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>

      {isEditOpen && (
        <Dialog open onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Chỉnh sửa câu hỏi</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input value={editData.content} onChange={e => setEditData({...editData, content: e.target.value})} placeholder="Nội dung câu hỏi" />
              <Select value={editData.difficultyLevel} onValueChange={v => setEditData({...editData, difficultyLevel: v})}>
                <SelectTrigger><SelectValue placeholder="Chọn độ khó"/></SelectTrigger>
                <SelectContent>
                  {difficultyLevels.filter(d => d.value !== 'all').map(dl => <SelectItem key={dl.value} value={dl.value}>{dl.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={editData.solutionContent} onChange={e => setEditData({...editData, solutionContent: e.target.value})} placeholder="Nội dung lời giải" />
              <Input value={editData.solutionExplanation} onChange={e => setEditData({...editData, solutionExplanation: e.target.value})} placeholder="Giải thích" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
              <Button onClick={saveEdit}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ModQuestion;
