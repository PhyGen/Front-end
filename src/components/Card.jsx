import React from "react";
import { MoreVertical, Download, FileText, Edit, Share2, Trash2, ChevronRight } from "lucide-react";
import { Card as ShadCard, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from 'react-router-dom';
import api from "@/config/axios";

const Card = ({
  id,
  title = "Tên file",
  previewUrl = "https://i.imgur.com/0y8Ftya.png",
  icon,
  onClick,
  fileUrl,
  onSoftDeleteSuccess,
  renderTrashMenu,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleCardClick = (e) => {
    if (onClick) onClick(e);
    if (id) {
      navigate(`/card-detail/${id}`, { state: { background: location } });
    } else {
      navigate('/card-detail', {
        state: { title, previewUrl, fileUrl, background: location }
      });
    }
  };

  const handleSoftDelete = async (e) => {
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm('Bạn có chắc chắn muốn chuyển vào thùng rác?')) return;
    try {
      await api.put(`/exams/${id}/soft-delete`);
      alert('Đã chuyển vào thùng rác thành công!');
      if (onSoftDeleteSuccess) onSoftDeleteSuccess(id);
    } catch {
      alert('Có lỗi khi chuyển vào thùng rác!');
    }
  };
  const cardProps = {
    className: "w-[240px] min-h-[270px] rounded-2xl shadow-md border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition hover:shadow-lg hover:bg-blue-100/80",
    style: { transition: 'background 0.2s, box-shadow 0.2s' },
  };
  if (typeof onClick === 'function') {
    cardProps.onClick = handleCardClick;
  }
  return (
    <ShadCard {...cardProps}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        {icon && <img src={icon} alt="File Icon" className="w-7 h-7" />}
        <CardTitle className="flex-1 text-center text-base font-semibold truncate px-2 text-black">
          {title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom-right" sideOffset={10} >
            {renderTrashMenu ? (
              renderTrashMenu()
            ) : (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => alert('Tải xuống PDF')}>
                      <FileText className="w-4 h-4 mr-2" /> PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert('Tải xuống Word')}>
                      <FileText className="w-4 h-4 mr-2" /> Word
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => alert('Đổi tên')}>
                  <Edit className="w-4 h-4 mr-2" /> Đổi tên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Chia sẻ')}>
                  <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSoftDelete} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Chuyển vào thùng rác
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
