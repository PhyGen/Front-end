import React from "react";
import spamIcon from "../assets/icons/spam-svgrepo-com.svg";
import { useTranslation } from 'react-i18next';

// Demo: đổi sang [] để test trạng thái rỗng
const spamFiles = [
  // { title: "Spam file 1", icon: spamIcon, previewUrl: "https://i.imgur.com/0y8Ftya.png" },
  // ...thêm file nếu muốn test trạng thái có file
];

const SpamContent = () => {
  const { t } = useTranslation();

  if (spamFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12 rounded-lg dark:bg-[#242526]">
        <img
          src={spamIcon}
          alt="No Spam"
          className="w-48 h-48 mb-6 object-contain dark:invert"
        />
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {t('no_spam_content')}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-base text-center">
          {t('spam_folder_note')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('spam_content')}</h1>
      {/* Hiển thị danh sách file spam nếu có */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {spamFiles.map((file, idx) => (
          <Card
            key={idx}
            title={file.title}
            icon={file.icon}
            previewUrl={file.previewUrl}
            onClick={() => {}}
            onMenuClick={() => {}}
          />
        ))}
      </div> */}
    </div>
  );
};

export default SpamContent;