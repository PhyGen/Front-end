import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/config/axios';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';

const getFileType = (url) => {
  if (!url) return '';
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  return 'other';
};

const CardDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errorQuestions, setErrorQuestions] = useState('');
  const navigate = useNavigate();

  // Lấy user từ localStorage
  let user = null;
  // Nếu cần lấy user, có thể dùng useAuth hoặc bỏ qua nếu không dùng đến

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    // Kiểm tra route để fetch đúng loại dữ liệu
    const pathname = window.location.pathname;
    if (pathname.startsWith('/myexam/')) {
      api.get(`/exams/${id}`)
        .then(res => setItem(res.data))
        .catch(() => setError('Không tìm thấy exam!'))
        .finally(() => setLoading(false));
    } else if (pathname.startsWith('/question/')) {
      api.get(`/questions/${id}`)
        .then(res => setItem(res.data))
        .catch(() => setError('Không tìm thấy câu hỏi!'))
        .finally(() => setLoading(false));
    } else {
      api.get(`/exams/${id}`)
        .then(res => setItem(res.data))
        .catch(() => setError('Không tìm thấy exam!'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingQuestions(true);
    setErrorQuestions('');
    const pathname = window.location.pathname;
    if (pathname.startsWith('/myexam/')) {
      Promise.all([
        api.get(`/exams/${id}/questions`),
        api.get(`/solutions`)
      ])
        .then(async ([examRes, solutionsRes]) => {
          const examQuestions = examRes.data || [];
          const allSolutions = Array.isArray(solutionsRes.data) ? solutionsRes.data : [];
          // Lấy nội dung từng câu hỏi và các trường chi tiết
          const questionDetails = await Promise.all(
            examQuestions.map(async (q) => {
              try {
                const detailRes = await api.get(`/questions/${q.questionId}`);
                const d = detailRes.data;
                // Lọc solution/explanation theo questionId
                const matchedSolutions = allSolutions.filter(sol => sol.questionId === q.questionId);
                let solution = '';
                let explanation = '';
                if (matchedSolutions.length > 0) {
                  solution = matchedSolutions.map(sol => sol.content).filter(Boolean).join('<hr/>');
                  explanation = matchedSolutions.map(sol => sol.explanation).filter(Boolean).join('<hr/>');
                }
                return {
                  ...q,
                  content: d?.content || 'Không có nội dung.',
                  questionSource: d?.questionSource || 'Không có nguồn.',
                  difficultyLevel: d?.difficultyLevel || 'Không rõ',
                  lessonName: d?.lessonName || 'Không xác định',
                  solution,
                  explanation,
                };
              } catch (err) {
                console.error('Error fetching question:', q.questionId, err);
                return { ...q, content: 'Không lấy được nội dung.', questionSource: 'Không có nguồn.', difficultyLevel: 'Không rõ', lessonName: 'Không xác định', solution: '', explanation: '' };
              }
            })
          );
          setQuestions(questionDetails);
        })
        .catch((err) => {
          setErrorQuestions('Không lấy được danh sách câu hỏi! ' + err.message);
        })
        .finally(() => setLoadingQuestions(false));
    } else if (pathname.startsWith('/question/')) {
      setQuestions([]); // Question chỉ có 1, không phải danh sách
    } else {
      Promise.all([
        api.get(`/exams/${id}/questions`),
        api.get(`/solutions`)
      ])
        .then(async ([examRes, solutionsRes]) => {
          const examQuestions = examRes.data || [];
          const allSolutions = Array.isArray(solutionsRes.data) ? solutionsRes.data : [];
          const questionDetails = await Promise.all(
            examQuestions.map(async (q) => {
              try {
                const detailRes = await api.get(`/questions/${q.questionId}`);
                const d = detailRes.data;
                const matchedSolutions = allSolutions.filter(sol => sol.questionId === q.questionId);
                let solution = '';
                let explanation = '';
                if (matchedSolutions.length > 0) {
                  solution = matchedSolutions.map(sol => sol.content).filter(Boolean).join('<hr/>');
                  explanation = matchedSolutions.map(sol => sol.explanation).filter(Boolean).join('<hr/>');
                }
                return {
                  ...q,
                  content: d?.content || 'Không có nội dung.',
                  questionSource: d?.questionSource || 'Không có nguồn.',
                  difficultyLevel: d?.difficultyLevel || 'Không rõ',
                  lessonName: d?.lessonName || 'Không xác định',
                  solution,
                  explanation,
                };
              } catch (err) {
                console.error('Error fetching question:', q.questionId, err);
                return { ...q, content: 'Không lấy được nội dung.', questionSource: 'Không có nguồn.', difficultyLevel: 'Không rõ', lessonName: 'Không xác định', solution: '', explanation: '' };
              }
            })
          );
          setQuestions(questionDetails);
        })
        .catch((err) => {
          setErrorQuestions('Không lấy được danh sách câu hỏi! ' + err.message);
        })
        .finally(() => setLoadingQuestions(false));
    }
  }, [id]);

  const fileType = getFileType(item?.fileUrl || item?.previewUrl);

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="w-full min-h-screen bg-white dark:bg-[#18191a] p-8">
        <div className="flex items-center mb-6 w-full">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2" /> Quay lại
          </Button>
          <div className="flex-1 text-right text-sm text-gray-500">
            Tài khoản: {user?.email || 'Khách'}
          </div>
        </div>
        {loading ? (
          <div className="w-full text-center py-8">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="w-full text-center text-red-600 py-8">{error}</div>
        ) : item ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-blue-700 text-center w-full">{item.title || 'Chi tiết'}</h2>
            <div className="flex flex-col items-center justify-center w-full">
              {fileType === 'image' && (
                <img src={item.fileUrl || item.previewUrl} alt={item.title} className="max-w-full max-h-[400px] rounded-lg border mb-6" />
              )}
              {fileType === 'pdf' && (
                <iframe
                  src={item.fileUrl || item.previewUrl}
                  title="PDF Preview"
                  className="w-full min-h-[300px] max-h-[400px] border rounded-lg mb-6"
                  frameBorder="0"
                />
              )}
              {fileType === 'word' && (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.fileUrl || item.previewUrl)}`}
                  title="Word Preview"
                  className="w-full min-h-[300px] max-h-[400px] border rounded-lg mb-6"
                  frameBorder="0"
                />
              )}
              {fileType === 'other' && (
                <div className="text-gray-500 mb-6">Không hỗ trợ xem trước loại file này.</div>
              )}
              <div className="mt-2 w-full">
                <div className="font-semibold">Mô tả:</div>
                <div className="text-gray-700 whitespace-pre-line">{item.description || 'Không có mô tả.'}</div>
              </div>
              <div className="mt-8 w-full">
                <div className="font-semibold mb-2 text-lg text-blue-700">Danh sách câu hỏi trong bài kiểm tra:</div>
                {loadingQuestions ? (
                  <div className="w-full text-center py-4">Đang tải câu hỏi...</div>
                ) : errorQuestions ? (
                  <div className="w-full text-center text-red-600 py-4">{errorQuestions}</div>
                ) : questions.length === 0 ? (
                  <div className="w-full text-center py-4">Chưa có câu hỏi nào trong bài kiểm tra này.</div>
                ) : (
                  <div className="flex-1 overflow-y-auto border rounded-lg bg-slate-50 w-full min-h-[320px]" style={{maxHeight: 'calc(100vh - 340px)'}}>
                    <ul className="list-decimal pl-6 space-y-4 py-4 pr-4">
                      {questions.map((q, idx) => (
                        <li key={q.questionId || q.id || idx} className="text-gray-800 bg-white rounded-lg p-4 border border-gray-200">
                          <div className="font-bold mb-2">Question {idx + 1}{q.difficultyLevel ? ` (${q.difficultyLevel})` : ''}:</div>
                          <div className="mb-2">
                            <RichTextRenderer html={q.content || ''} />
                          </div>
                          <div className="mb-2">
                            <span className="font-bold text-green-700">Solution:</span>
                            <span className="ml-2"><RichTextRenderer html={q.solution || '<span class="italic text-gray-400">No solution</span>'} /></span>
                          </div>
                          <div className="mb-2">
                            <span className="font-bold text-blue-700">Explanation:</span>
                            <span className="ml-2"><RichTextRenderer html={q.explanation || '<span class="italic text-gray-400">No explanation</span>'} /></span>
                          </div>
                          <div className="mb-2"><span className="font-semibold">Source:</span> {q.questionSource}</div>
                          <div><span className="font-semibold">Lesson:</span> {q.lessonName}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CardDetail; 