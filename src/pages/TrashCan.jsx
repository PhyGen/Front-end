import React from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";
import emptyTrashIcon from "@/assets/icons/empty_trash_icon.png";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

// Demo: đổi sang [] để test trạng thái rỗng
const trashFiles = [
  // { title: "File đã xóa 1", icon: pdfIcon, previewUrl: "https://i.imgur.com/0y8Ftya.png" },
  // { title: "File đã xóa 2", icon: wordIcon, previewUrl: "https://i.imgur.com/0y8Ftya.png" },
  // ...thêm file nếu muốn test trạng thái có file
];

const TrashCan = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (trashFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <img src={emptyTrashIcon} alt="Empty Trash" className="w-48 h-48 mb-6 object-contain" />
        <div
          className={`text-2xl font-semibold mb-2 ${theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'text-white' : 'text-gray-800'}`}
        >
          {t('empty_trash_can')}
        </div>
        <div className="text-gray-500 text-base">
          {t('empty_trash_can_description')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('trash_can')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {trashFiles.map((file, idx) => (
          <Card
            key={idx}
            title={file.title}
            icon={file.icon}
            previewUrl={file.previewUrl}
            onClick={() => {}}
            onMenuClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default TrashCan; 