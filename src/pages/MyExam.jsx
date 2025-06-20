import React from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";

const samplePreviews = [
  "https://i.imgur.com/0y8Ftya.png",
  "https://i.imgur.com/0y8Ftya.png",
  "https://i.imgur.com/0y8Ftya.png",
  "https://i.imgur.com/0y8Ftya.png",
  "https://i.imgur.com/0y8Ftya.png",
  "https://i.imgur.com/0y8Ftya.png",
];

const sampleTitles = [
  "Xác suất thống kê",
  "Giải tích 1",
  "Vật lý đại cương",
  "Hóa học cơ bản",
  "Lập trình Python",
  "Kinh tế lượng",
];

const sampleIcons = [
  pdfIcon,
  wordIcon,
  pdfIcon,
  pdfIcon,
  wordIcon,
  pdfIcon,
];

const MyExam = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">My Exam</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {samplePreviews.map((preview, idx) => (
        <Card
          key={idx}
          title={sampleTitles[idx]}
          previewUrl={preview}
          icon={sampleIcons[idx]}
          onClick={() => {}}
          onMenuClick={() => {}}
        />
      ))}
    </div>
  </div>
);

export default MyExam; 