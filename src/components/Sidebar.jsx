import React from 'react';
import houseIcon from '../assets/icons/house.svg';
import examIcon from '../assets/icons/exam-svgrepo-com.svg';
import sharedIcon from '../assets/icons/shared-with-me.svg';
import recentIcon from '../assets/icons/recent-svgrepo-com.svg';
import starIcon from '../assets/icons/star-shape-1-svgrepo-com.svg';
import botIcon from '../assets/icons/bot.svg';
import spamIcon from '../assets/icons/spam-svgrepo-com.svg';
import trashIcon from '../assets/icons/trash-can-svgrepo-com.svg';
import createIcon from '../assets/icons/create-icon.svg';

const sidebarItems = [
  { key: 'home', label: 'Home', icon: houseIcon },
  { key: 'myExam', label: 'My Exam', icon: examIcon },
  { key: 'shared', label: 'Shared with me', icon: sharedIcon },
  { key: 'recent', label: 'Recently', icon: recentIcon },
  { key: 'starred', label: 'Starred', icon: starIcon },
  { key: 'ai', label: 'AI generate', icon: botIcon },
  { key: 'spam', label: 'Spam Content', icon: spamIcon },
  { key: 'trash', label: 'Trash Can', icon: trashIcon },
];

const Sidebar = ({ activeKey, onSelect }) => {
  return (
    <aside className="w-[210px] bg-blue-50 rounded-2xl min-h-screen flex flex-col items-center py-8 shadow">
      <ul className="w-full flex flex-col gap-1">
        <li className="bg-sky-400 text-white font-bold justify-center text-lg mb-4 flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer select-none hover:bg-sky-500" onClick={() => onSelect('create')}>
          <img src={createIcon} alt="Create" className="w-7 h-7" />
          <span>Create</span>
        </li>
        {sidebarItems.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer transition font-medium text-gray-700 select-none
              ${activeKey === item.key ? 'bg-sky-100 text-sky-500' : 'hover:bg-sky-100 hover:text-sky-500'}
            `}
            onClick={() => onSelect(item.key)}
          >
            <img src={item.icon} alt={item.label} className="w-7 h-7" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar; 