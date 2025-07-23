import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";
import api from "@/config/axios";
import { useAuth } from "@/context/AuthContext";

const MyExam = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;
    setLoading(true);
    api.get(`/exams/user/${user.id}`)
      .then(res => setExams(res.data || []))
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
            title={exam.title || exam.name || "Exam"}
            previewUrl={exam.previewUrl || "https://i.imgur.com/0y8Ftya.png"}
            icon={exam.fileType === 'docx' ? wordIcon : pdfIcon}
            onClick={() => {}}
            onSoftDeleteSuccess={() => setExams(prev => prev.filter(e => e.id !== exam.id))}
          />
        ))
      )}
    </div>
  );
};

export default MyExam; 