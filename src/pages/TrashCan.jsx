import React from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";
import emptyTrashIcon from "@/assets/icons/empty_trash_icon.png";

// Demo: đổi sang [] để test trạng thái rỗng
const trashFiles = [
  // { title: "File đã xóa 1", icon: pdfIcon, previewUrl: "https://i.imgur.com/0y8Ftya.png" },
  // { title: "File đã xóa 2", icon: wordIcon, previewUrl: "https://i.imgur.com/0y8Ftya.png" },
  // ...thêm file nếu muốn test trạng thái có file
];

const TrashCan = () => {
  if (trashFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <img src={emptyTrashIcon} alt="Empty Trash" className="w-48 h-48 mb-6 object-contain" />
        <div className="text-2xl font-semibold text-gray-800 mb-2">Empty trash can</div>
        <div className="text-gray-500 text-base">
          Items moved to the trash will be permanently deleted after 30 days.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Trash Can</h1>
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