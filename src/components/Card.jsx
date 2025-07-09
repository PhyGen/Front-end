import React from "react";
import { MoreVertical } from "lucide-react";
import {
  Card as ShadCard,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

const Card = ({
  title = "Tên file",
  previewUrl = "https://i.imgur.com/0y8Ftya.png",
  icon,
  onClick,
  onMenuClick,
}) => (
  <ShadCard
    className="w-[240px] min-h-[270px] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col justify-between cursor-pointer transition hover:shadow-lg dark:hover:shadow-blue-500/20 hover:bg-blue-100/80 dark:hover:bg-gray-700"
    style={{ transition: 'background 0.2s, box-shadow 0.2s' }}
    onClick={onClick}
  >
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      {icon && <img src={icon} alt="File Icon" className="w-7 h-7" />}
      <CardTitle className="flex-1 text-center text-base font-semibold truncate px-2 text-gray-800 dark:text-gray-200">
        {title}
      </CardTitle>
      <button
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
        onClick={e => {
          e.stopPropagation();
          onMenuClick && onMenuClick();
        }}
      >
        <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-400" />
      </button>
    </div>
    <CardContent className="flex flex-col items-center justify-end flex-1 pb-4 pt-0">
      <div className="w-[92%] h-[140px] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
        <img
          src={previewUrl}
          alt="File Preview"
          className="object-cover w-full h-full"
          draggable={false}
        />
      </div>
    </CardContent>
  </ShadCard>
);

export default Card;
