import React from "react";
import Card from "@/components/Card";
import SharedWithMe from './SharedWithMe';
import { useTranslation } from 'react-i18next';

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

const todayPreviews = [samplePreviews[0]];
const todayTitles = [sampleTitles[0]];
const weekPreviews = [samplePreviews[1], samplePreviews[2]];
const weekTitles = [sampleTitles[1], sampleTitles[2]];
const monthPreviews = [samplePreviews[3], samplePreviews[4], samplePreviews[5]];
const monthTitles = [sampleTitles[3], sampleTitles[4], sampleTitles[5]];
const yearPreviews = [samplePreviews[6], samplePreviews[7], samplePreviews[8]];
const yearTitles = [sampleTitles[6], sampleTitles[7], sampleTitles[8]];

const Shared = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 mt-6 px-4">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-left">{t('today')}</h2>
        <div className="flex flex-wrap gap-6">
          {todayPreviews.map((preview, idx) => (
            <Card
              key={idx}
              title={todayTitles[idx]}
              previewUrl={preview}
              onClick={() => {}}
              onMenuClick={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4 text-left">{t('this_week')}</h2>
        <div className="flex flex-wrap gap-6">
          {weekPreviews.map((preview, idx) => (
            <Card 
              key={idx}
              title={weekTitles[idx]}
              previewUrl={preview}
              onClick={() => {}}
              onMenuClick={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4 text-left">{t('this_month')}</h2>
        <div className="flex flex-wrap gap-6">
          {monthPreviews.map((preview, idx) => (
            <Card
              key={idx}
              title={monthTitles[idx]}
              previewUrl={preview}
              onClick={() => {}}
              onMenuClick={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4 text-left">{t('this_year', { year: new Date().getFullYear() })}</h2>
        <div className="flex flex-wrap gap-6">
          {yearPreviews.map((preview, idx) => (
            <Card
              key={idx}
              title={yearTitles[idx]}
              previewUrl={preview}
              onClick={() => {}}
              onMenuClick={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4 text-left">{t('older')}</h2>
        <div className="flex flex-wrap gap-6">
          {yearPreviews.map((preview, idx) => (
            <Card
              key={idx}
              title={yearTitles[idx]}
              previewUrl={preview}
              onClick={() => {}}
              onMenuClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shared;