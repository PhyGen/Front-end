import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";
import emptyTrashIcon from "@/assets/icons/empty_trash_icon.png";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import api from "@/config/axios";
import { useAuth } from "@/context/AuthContext";

const TrashCan = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;
    setLoading(true);
    api.get(`/exams/user/${user.id}?isDeleted=true`)
      .then(res => setTrashFiles(res.data || []))
      .catch(() => setTrashFiles([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px] py-12">Đang tải dữ liệu...</div>;
  }

  // Chỉ hiển thị các exam đã bị xóa (isDeleted === true)
  const deletedExams = trashFiles.filter(f => f.isDeleted);

  if (!deletedExams || deletedExams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <img src={emptyTrashIcon} alt="Empty Trash" className="w-48 h-48 mb-6 object-contain" />
        <div
          className={`text-2xl font-semibold mb-2 ${theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'text-white' : 'text-gray-800'}`}
        >
          {t('empty_trash_can')}
        </div>
        <div className="text-gray-500 text-base">
          Items moved to the trash will be permanently deleted after 30 days
        </div>
      </div>
    );
  }

  const handleRecover = async (id) => {
    try {
      await api.put(`/exams/${id}/recover`);
      alert('Khôi phục thành công!');
      setTrashFiles(prev => prev.filter(f => f.id !== id));
    } catch {
      alert('Có lỗi khi khôi phục!');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('trash_can')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {deletedExams.map((file) => (
          <Card
            key={file.id}
            id={file.id}
            title={file.title || file.name || "Exam"}
            icon={file.fileType === 'docx' ? wordIcon : pdfIcon}
            previewUrl={file.previewUrl || "https://i.imgur.com/0y8Ftya.png"}
            renderTrashMenu={() => (
              <>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#23272f] dark:text-[#e4e6eb]"
                  onClick={() => handleRecover(file.id)}
                >
                  Khôi phục
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-[#23272f] dark:text-red-400"
                  onClick={() => alert('Chức năng xóa vĩnh viễn sẽ sớm có!')}
                >
                  Xóa vĩnh viễn
                </button>
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default TrashCan; 