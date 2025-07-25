import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { useTranslation } from 'react-i18next';
import api from "@/config/axios";
import { useAuth } from "@/context/AuthContext";

const Recently = () => {
  const { t } = useTranslation();
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

  // Helper để phân loại exam theo thời gian
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const group = {
    today: [],
    yesterday: [],
    earlierThisMonth: [],
    lastMonth: [],
    earlierThisYear: [],
    older: [],
  };

  exams.filter(exam => !exam.isDeleted).forEach(exam => {
    const created = new Date(exam.createdAt);
    const createdStr = created.toISOString().slice(0, 10);
    if (createdStr === today) {
      group.today.push(exam);
    } else if (createdStr === yesterdayStr) {
      group.yesterday.push(exam);
    } else if (created.getFullYear() === thisYear && created.getMonth() === thisMonth) {
      group.earlierThisMonth.push(exam);
    } else if (created.getFullYear() === lastMonthYear && created.getMonth() === lastMonth) {
      group.lastMonth.push(exam);
    } else if (created.getFullYear() === thisYear) {
      group.earlierThisYear.push(exam);
    } else {
      group.older.push(exam);
    }
  });

  // Ẩn section nếu không có file nào thuộc nhóm đó
  const sections = [
    { key: 'today', label: t('today') },
    { key: 'yesterday', label: t('yesterday') },
    { key: 'earlierThisMonth', label: t('earlier_this_month') },
    { key: 'lastMonth', label: t('last_month') },
    { key: 'earlierThisYear', label: t('earlier_this_year') },
    { key: 'older', label: t('older') },
  ].filter(sec => group[sec.key] && group[sec.key].length > 0);

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('recently')}</h1>
      {loading ? (
        <div className="text-center py-8">Đang tải dữ liệu...</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-8">Không có bài kiểm tra nào gần đây.</div>
      ) : (
        sections.map(sec => (
          <TimeSection key={sec.key} label={sec.label}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {group[sec.key].map(exam => (
                <Card
                  key={exam.id}
                  id={exam.id}
                  title={exam.name || "Exam"}
                  onClick={() => {}}
                  questions={exam.questions || []}
                   type="exam"
                />
              ))}
            </div>
          </TimeSection>
        ))
      )}
    </div>
  );
};

const TimeSection = ({ label, children }) => (
  <div className="mb-10">
    <div className="flex items-center mb-4">
      <span className="text-base font-semibold text-gray-700 dark:text-gray-300 mr-4">{label}</span>
      <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
    </div>
    {children}
  </div>
);

export default Recently; 