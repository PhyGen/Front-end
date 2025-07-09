import React from "react";
import { MoreVertical } from "lucide-react";
import {
  Card as ShadCard,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const Card = ({
  title = "Tên file",
  previewUrl = "https://i.imgur.com/0y8Ftya.png",
  icon,
  onClick,
  onMenuClick,
  fileUrl,
}) => {
  const navigate = useNavigate();
  const handleCardClick = (e) => {
    if (onClick) onClick(e);
    navigate('/card-detail', {
      state: { title, previewUrl, fileUrl }
    });
  };
  return (
    <ShadCard
      className="w-[240px] min-h-[270px] rounded-2xl shadow-md border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition hover:shadow-lg hover:bg-blue-100/80"
      style={{ transition: 'background 0.2s, box-shadow 0.2s' }}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        {icon && <img src={icon} alt="File Icon" className="w-7 h-7" />}
        <CardTitle className="flex-1 text-center text-base font-semibold truncate px-2">
          {title}
        </CardTitle>
        <button
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={e => {
            e.stopPropagation();
            onMenuClick && onMenuClick();
          }}
        >
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <CardContent className="flex flex-col items-center justify-end flex-1 pb-4 pt-0">
        <div className="w-[92%] h-[140px] bg-gray-100 rounded-xl overflow-hidden">
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
};

export default Card;
