import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import api from "@/config/axios";
import { useAuth } from "@/context/AuthContext";

// Hàm tạo HTML cho các câu hỏi
function renderQuestionsHTML(questions = [], examTitle = '') {
  let html = `<h2 style="text-align:center; color:#2563eb;">${examTitle}</h2>`;
  questions.forEach((q, idx) => {
    html += `
      <div style="margin-bottom: 24px;">
        <div style="font-weight: bold;">Câu ${idx + 1}:</div>
        <div><b>Nội dung:</b> ${q.content || ''}</div>
        <div><b>Nguồn:</b> ${q.questionSource || ''}</div>
        <div><b>Độ khó:</b> ${q.difficultyLevel || ''}</div>
        <div><b>Bài học:</b> ${q.lessonName || ''}</div>
      </div>
    `;
  });
  return html;
}

const MyExam = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;
    setLoading(true);
    api.get(`/exams/user/${user.id}`)
      .then(async res => {
        const examsRaw = res.data || [];
        // Lấy questions cho từng exam
        const examsWithQuestions = await Promise.all(examsRaw.map(async (exam) => {
          try {
            const qres = await api.get(`/exams/${exam.id}/questions`);
            // Nếu API trả về mảng các object có trường questionId, cần fetch chi tiết từng question
            const questionIds = (qres.data || []).map(q => q.questionId);
            const questions = await Promise.all(questionIds.map(async (qid) => {
              try {
                const detail = await api.get(`/questions/${qid}`);
                return detail.data;
              } catch {
                return null;
              }
            }));
            return { ...exam, questions: questions.filter(Boolean) };
          } catch {
            return { ...exam, questions: [] };
          }
        }));
        setExams(examsWithQuestions);
      })
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-8">Đang tải dữ liệu...</div>
      ) : exams.length === 0 ? (
        <div className="col-span-full text-center py-8">Không có bài kiểm tra nào.</div>
      ) : (
        exams.filter(exam => !exam.isDeleted).map((exam) => (
          <Card
            key={exam.id}
            id={exam.id}
            title={exam.name || "Exam"}
            onClick={() => {}}
            onSoftDeleteSuccess={() => setExams(prev => prev.filter(e => e.id !== exam.id))}
            questions={exam.questions || []}
            type="exam"
          />
        ))
      )}
    </div>
  );
};

export default MyExam;