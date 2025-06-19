import React from "react";
import PdfCard from "@/components/PdfCard";

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

const MyExam = () => (
  <div className="flex flex-wrap gap-6 justify-center mt-6">
    {samplePreviews.map((preview, idx) => (
      <PdfCard
        key={idx}
        title={sampleTitles[idx]}
        previewUrl={preview}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
    ))}
  </div>
);

export default MyExam; 