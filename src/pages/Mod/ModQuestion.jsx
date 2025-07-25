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
import { useNavigate } from 'react-router-dom';

// Component để hiển thị video từ API
const VideoPlayer = ({ solutionId }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState(null);

  useEffect(() => {
    if (solutionId) {
      loadVideo();
    }
  }, [solutionId]);

  const loadVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Loading video for solution ID: ${solutionId}`);
      
      // Test API call trước
      const testResponse = await api.get(`/solutions/${solutionId}`);
      console.log('Solution data:', testResponse.data);
      
      // Thử với endpoint đầy đủ như Postman
      const response = await api.get(`/api/solutions/${solutionId}/video`, {
        responseType: 'blob',
        headers: {
          'Accept': 'video/*',
        },
      });
      
      if (response.status === 200) {
        console.log("Video Manim Response:", response);
        console.log("Response Headers:", response.headers);
        console.log("Response Data Type:", typeof response.data);
        console.log("Response Data Size:", response.data.size);
        
        const blob = response.data;
        const contentType = response.headers['content-type'] || 'video/mp4';
        setContentType(contentType);
        
        // Kiểm tra xem blob có hợp lệ không
        if (blob && blob.size > 0) {
          // Tạo blob với content type chính xác
          const videoBlob = new Blob([blob], { type: contentType });
          const url = URL.createObjectURL(videoBlob);
          console.log("Created Video URL:", url);
          console.log("Content Type:", contentType);
          setVideoUrl(url);
        } else {
          console.error("Invalid blob data:", blob);
          setError('Invalid video data');
        }
      } else {
        console.error("Response status not 200:", response.status);
        setError('Failed to load video');
      }
    } catch (err) {
      console.error('Error loading video:', err);
      console.error('Error details:', err.response);
      setError('Video not available');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup URL khi component unmount hoặc solutionId thay đổi
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
      }
    };
  }, [videoUrl, solutionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-32 h-20 bg-gray-100 rounded">
        <img src={loadingGif} alt="loading" className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-32 h-20 bg-gray-100 rounded text-xs text-gray-500 p-1">
        <span>{error}</span>
        <span className="text-xs text-gray-400">ID: {solutionId}</span>
        {contentType && <span className="text-xs text-gray-400">Type: {contentType}</span>}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center w-32 h-20 bg-gray-100 rounded text-xs text-gray-500">
        No video
      </div>
    );
  }

  return (
    <video 
      src={videoUrl} 
      controls 
      className="w-32 h-20 object-cover rounded border"
      preload="metadata"
      onError={(e) => {
        console.error('Video error:', e);
        setError('Video playback error');
      }}
      onLoadStart={() => console.log('Video loading started')}
      onLoadedData={() => console.log('Video data loaded successfully')}
    />
  );
};

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
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // confirmed filters
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [lessonId, setLessonId] = useState('all');
  const [chapterId, setChapterId] = useState('all');
  const [difficultyLevel, setDifficultyLevel] = useState('all');
  
  // pending filters
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingSort, setPendingSort] = useState('createdAt:desc');
  const [pendingLessonId, setPendingLessonId] = useState('all');
  const [pendingChapterId, setPendingChapterId] = useState('all');
  const [pendingDifficultyLevel, setPendingDifficultyLevel] = useState('all');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    questionId: null,
    content: '',
    difficultyLevel: 'easy',
    solutionId: null,
    solutionContent: '',
    solutionExplanation: ''
  });

  // initial fetch of options
  useEffect(() => {
    api.get('/lessons',{
      params: {
        chapterId: pendingChapterId !== 'all' ? pendingChapterId : undefined,
      }
    }).then(res => setLessons(res.data.items || []));
    api.get('/chapters').then(res => setChapters(res.data || []));
  }, [pendingChapterId]);

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
        const filteredItems = (res.data.items || []).filter(item => item.id >= 0);
        setQuestions(filteredItems);
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

  const fetchSolutions = async () => {
    try {
      const res = await api.get('/solutions');
      console.log('All solutions:', res.data);
      setSolutions(res.data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
      setSolutions([]);
    }
  };

  // fetch whenever confirmed filters or pagination change
  useEffect(() => {
    fetchQuestions();
    fetchSolutions();
  }, [page, pageSize, search, sort, lessonId, chapterId, difficultyLevel]);

  // apply pending filters
  const handleSearch = () => {
    setSearch(pendingSearch);
    setSort(pendingSort);
    setLessonId(pendingLessonId);
    setChapterId(pendingChapterId);
    setDifficultyLevel(pendingDifficultyLevel);
    setPage(1);
  };

  // reset all filters
  const handleReset = () => {
    setPendingSearch(''); setSearch('');
    setPendingSort('createdAt:desc'); setSort('createdAt:desc');
    setPendingLessonId('all'); setLessonId('all');
    setPendingChapterId('all'); setChapterId('all');
    setPendingDifficultyLevel('all'); setDifficultyLevel('all');
    setPage(1);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await api.delete(`/questions/${questionId}`);
      const sol = solutions.find(s => s.questionId === questionId);
      if (sol) await api.delete(`/solutions/${sol.id}`);
      fetchQuestions(); fetchSolutions();
    } catch {
      alert('Xóa thất bại, vui lòng thử lại');
    }
  };

  const handleEdit = (row) => {
    const sol = solutions.find(s => s.questionId === row.id) || {};
    setEditData({
      questionId: row.id,
      content: row.content,
      difficultyLevel: row.difficultyLevel,
      solutionId: sol.id || null,
      solutionContent: sol.content || '',
      solutionExplanation: sol.explanation || ''
    });
    setIsEditOpen(true);
  };

  const handleAddSolutionByAI = (questionId) => {
    navigate('/mod?selected=pgvideo&questionId=' + questionId);
  };


  const saveEdit = async () => {
    try {
      await api.put(`/questions/${editData.questionId}`, {
        id: editData.questionId,
        content: editData.content,
        difficultyLevel: editData.difficultyLevel
      });
      if (editData.solutionId) {
        await api.put(`/solutions/${editData.solutionId}`, {
          id: editData.solutionId,
          content: editData.solutionContent,
          explanation: editData.solutionExplanation
        });
      }
      setIsEditOpen(false);
      fetchQuestions(); fetchSolutions();
    } catch {
      alert('Cập nhật thất bại, vui lòng thử lại');
    }
  };

  const [isUpdateVideoOpen, setIsUpdateVideoOpen] = useState(false);
  const [updateVideoFile, setUpdateVideoFile] = useState(null);
  const [updatingSolutionId, setUpdatingSolutionId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleOpenUpdateVideo = (solutionId) => {
    setUpdatingSolutionId(solutionId);
    setIsUpdateVideoOpen(true);
    setUpdateVideoFile(null);
  };

  useEffect(() => {
    console.log('updatingSolutionId', updatingSolutionId);
    console.log('updateVideoFile', updateVideoFile);
  }, [updatingSolutionId,updateVideoFile]);

  const handleUpdateVideo = async () => {
    if (!updateVideoFile || !updatingSolutionId) return;
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('SolutionId', updatingSolutionId);
      formData.append('Content', 'Test update video');
      formData.append('VideoFile', updateVideoFile);
      await api.put(`/solutions/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsUpdateVideoOpen(false);
      setUpdatingSolutionId(null);
      setUpdateVideoFile(null);
      fetchQuestions();
      fetchSolutions();
    } catch (e) {
      alert('Update video thất bại!');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* SEARCH & FILTERS */}
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <Input
            value={pendingSearch}
            onChange={e => setPendingSearch(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi..."
            className="w-64"
          />

          <Select value={pendingChapterId} onValueChange={v => setPendingChapterId(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Lọc theo chương" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chương</SelectItem>
              {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={pendingLessonId} onValueChange={v => setPendingLessonId(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Lọc theo bài học" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bài học</SelectItem>
              {lessons.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
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
          <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">Tìm kiếm</Button>
          <Button onClick={handleReset} variant="outline">Đặt lại</Button>
        </div>

                 {/* ITEMS COUNT & PAGE SIZE */}
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

        {/* TABLE */}
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
                  <th className="px-4 py-2 border-b">Solution</th>
                  <th className="px-4 py-2 border-b">Explanation</th>
                  <th className="px-4 py-2 border-b">Video</th>
                  <th className="px-4 py-2 border-b">Lesson</th>
                  <th className="px-4 py-2 border-b">Chapter</th>
                  <th className="px-4 py-2 border-б">Difficulty</th>
                  <th className="px-4 py-2 border-б">Created By</th>
                  <th className="px-4 py-2 border-б">Created At</th>
                  <th className="px-4 py-2 border-б">Updated At</th>
                  <th className="px-4 py-2 border-б">Actions</th>
                </tr>
              </thead>
              <tbody>
                                 {questions.map(row => {
                   const matchedSolution = solutions.find(s => s.questionId === row.id);
                   console.log(`Question ${row.id} - Matched solution:`, matchedSolution);
                   return (
                    <tr key={row.id} className="even:bg-slate-50">
                      <td className="px-4 py-2 border-b text-center">{row.id}</td>
                      <td className="px-4 py-2 border-б">{row.content}</td>
                      <td className="px-4 py-2 border-б">{matchedSolution?.content || '-'}</td>
                      <td className="px-4 py-2 border-б">{matchedSolution?.explanation || '-'}</td>
                                             <td className="px-4 py-2 border-б">
                        {matchedSolution?.videoData ? (
                          <a href={matchedSolution.videoData} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Xem video</a>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-32 h-20 bg-gray-100 rounded text-xs text-gray-500 p-1">
                            <span>No video</span>
                            <span className="text-xs text-gray-400">Q: {row.id}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border-б">{row.lessonName}</td>
                      <td className="px-4 py-2 border-б">{row.chapterName}</td>
                      <td className="px-4 py-2 border-б">{row.difficultyLevel}</td>
                      <td className="px-4 py-2 border-б">{row.createdByUserName}</td>
                      <td className="px-4 py-2 border-б">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2 border-б">{formatDate(row.updatedAt)}</td>
                                             <td className="px-4 py-2 border flex gap-2">
                         <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(row)}>Edit</Button>
                         <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAddSolutionByAI(row.id)}>Add Solution By AI</Button>
                         <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => handleOpenUpdateVideo(matchedSolution?.id)} disabled={!matchedSolution?.id}>Update Video</Button>
                         <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(row.id)}>Delete</Button>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
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

      {/* EDIT DIALOG */}
      {isEditOpen && (
        <Dialog open onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Chỉnh sửa câu hỏi</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input value={editData.content} onChange={e => setEditData({...editData, content: e.target.value})} placeholder="Nội dung câu hỏi" />
              <Select value={editData.difficultyLevel} onValueChange={v => setEditData({...editData, difficultyLevel: v})}>
                <SelectTrigger><SelectValue placeholder="Chọn độ khó"/></SelectTrigger>
                <SelectContent>
                  {difficultyLevels.filter(d => d.value!=='all').map(dl => <SelectItem key={dl.value} value={dl.value}>{dl.label}</SelectItem>)}
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

      {isUpdateVideoOpen && (
        <Dialog open onOpenChange={setIsUpdateVideoOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cập nhật video cho Solution</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input type="file" accept="video/*" onChange={e => setUpdateVideoFile(e.target.files[0])} />
              {updateVideoFile && <video src={URL.createObjectURL(updateVideoFile)} controls className="w-full max-h-64 rounded" />}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateVideoOpen(false)}>Hủy</Button>
              <Button onClick={handleUpdateVideo} disabled={!updateVideoFile || updateLoading}>{updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ModQuestion;
