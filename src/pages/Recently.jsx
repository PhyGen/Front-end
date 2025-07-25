import React from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";
import { useTranslation } from 'react-i18next';

const Recently = () => {
  const { t } = useTranslation();

  const groupData = [
    {
      label: t('today'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
    },
    {
      label: t('yesterday'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
    },
    {
      label: t('earlier_this_month'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
    },
    {
      label: t('last_month'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
    },
    {
      label: t('earlier_this_year'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
    },
    {
      label: t('older'),
      cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('recently')}</h1>
      {groupData.map((group) => (
        <TimeSection key={group.label} label={group.label}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {group.cards.map((card, i) => (
              <Card
                key={i}
                title={card.title}
                icon={card.icon}
                previewUrl="https://i.imgur.com/0y8Ftya.png"
                onClick={() => {}}
                onMenuClick={() => {}}
              />
            ))}
          </div>
        </TimeSection>
      ))}
    </div>
  );
};

const TimeSection = ({ label, children }) => (
  <div className="mb-10">
    <div className="flex items-center mb-4">
      <span className="text-base font-semibold text-gray-700 dark:text-gray-300 mr-4">{label}</span>
      <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
    </div>
    {children}
  </div>
);

export default Recently; 