import React from "react";
import Card from "@/components/Card";

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

const Starred = () => (
  <div className="flex flex-wrap gap-6 justify-left mt-5">
    {samplePreviews.map((preview, idx) => (
      <Card
        key={idx}
        title={sampleTitles[idx]}
        previewUrl={preview}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
    ))}
  </div>
);

export default Starred;