import React from "react";
import Card from "@/components/Card";
import pdfIcon from "@/assets/icons/pdf-icon.svg";
import wordIcon from "@/assets/icons/word-icon.svg";

const groupData = [
  {
    label: "Today",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
  },
  {
    label: "Yesterday",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
  },
  {
    label: "Earlier this month",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
  },
  {
    label: "Last month",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
  },
  {
    label: "Earlier this year",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: pdfIcon }),
  },
  {
    label: "Older",
    cards: Array(5).fill({ title: "KT 1 tiết 10a2", icon: wordIcon }),
  },
];

const TimeSection = ({ label, children }) => (
  <div className="mb-10">
    <div className="flex items-center mb-4">
      <span className="text-base font-semibold text-gray-700 mr-4">{label}</span>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
    {children}
  </div>
);

const Recently = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">Recently</h1>
    {groupData.map((group, idx) => (
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

export default Recently; 