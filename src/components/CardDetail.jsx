import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/config/axios';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const getFileType = (url) => {
  if (!url) return '';
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  return 'other';
};

const CardDetail = () => {
  const { itemId } = useParams();
  const id = itemId;
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
    // Giả sử API exam detail là /api/exams/:id
    api.get(`/exams/${id}`)
      .then(res => setItem(res.data))
      .catch(() => setError('Không tìm thấy exam!'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingQuestions(true);
    setErrorQuestions('');
    api.get(`/exams/${id}/questions`)
      .then(async res => {
        const examQuestions = res.data || [];
        console.log('Exam questions:', examQuestions);
        // Lấy nội dung từng câu hỏi và các trường chi tiết
        const questionDetails = await Promise.all(
          examQuestions.map(async (q) => {
            try {
              const detailRes = await api.get(`/questions/${q.questionId}`);
              const d = detailRes.data;
              return {
                ...q,
                content: d?.content || 'Không có nội dung.',
                questionSource: d?.questionSource || 'Không có nguồn.',
                difficultyLevel: d?.difficultyLevel || 'Không rõ',
                lessonName: d?.lessonName || 'Không xác định',
              };
            } catch (err) {
              console.error('Error fetching question:', q.questionId, err);
              return { ...q, content: 'Không lấy được nội dung.', questionSource: 'Không có nguồn.', difficultyLevel: 'Không rõ', lessonName: 'Không xác định' };
            }
          })
        );
        console.log('Detailed questions:', questionDetails);
        setQuestions(questionDetails);
      })
      .catch((err) => {
        setErrorQuestions('Không lấy được danh sách câu hỏi! ' + err.message);
      })
      .finally(() => setLoadingQuestions(false));
  }, [id]);

  const fileType = getFileType(item?.fileUrl || item?.previewUrl);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" /> Quay lại
        </Button>
        <div className="flex-1 text-right text-sm text-gray-500">
          Tài khoản: {user?.email || 'Khách'}
        </div>
      </div>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : item ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">{item.title || 'Chi tiết'}</h2>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {fileType === 'image' && (
              <img src={item.fileUrl || item.previewUrl} alt={item.title} className="max-w-full max-h-[600px] rounded-lg border" />
            )}
            {fileType === 'pdf' && (
              <iframe
                src={item.fileUrl || item.previewUrl}
                title="PDF Preview"
                className="w-full min-h-[600px] border rounded-lg"
                frameBorder="0"
              />
            )}
            {fileType === 'word' && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.fileUrl || item.previewUrl)}`}
                title="Word Preview"
                className="w-full min-h-[600px] border rounded-lg"
                frameBorder="0"
              />
            )}
            {fileType === 'other' && (
              <div className="text-gray-500">Không hỗ trợ xem trước loại file này.</div>
            )}
            <div className="mt-6 w-full">
              <div className="font-semibold">Mô tả:</div>
              <div className="text-gray-700 whitespace-pre-line">{item.description || 'Không có mô tả.'}</div>
            </div>
            <div className="mt-8 w-full">
              <div className="font-semibold mb-2 text-lg text-blue-700">Danh sách câu hỏi trong bài kiểm tra:</div>
              {loadingQuestions ? (
                <div>Đang tải câu hỏi...</div>
              ) : errorQuestions ? (
                <div className="text-red-600">{errorQuestions}</div>
              ) : questions.length === 0 ? (
                <div>Chưa có câu hỏi nào trong bài kiểm tra này.</div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto border rounded-lg bg-white">
                  <ul className="list-decimal pl-6 space-y-4">
                    {questions.map((q, idx) => (
                      <li key={q.questionId || q.id || idx} className="text-gray-800 bg-slate-50 rounded-lg p-4 shadow-sm">
                        <div className="font-semibold">Câu {idx + 1}:</div>
                        <div className="font-semibold">Nội dung: <span className="font-normal">{q.content}</span></div>
                        <div><span className="font-semibold">Nguồn:</span> {q.questionSource}</div>
                        <div><span className="font-semibold">Độ khó:</span> {q.difficultyLevel}</div>
                        <div><span className="font-semibold">Bài học:</span> {q.lessonName}</div>
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
  );
};

export default CardDetail; 