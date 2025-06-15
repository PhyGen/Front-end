import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HomeBox from '../components/Home';

const Placeholder = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-full text-2xl text-sky-500 font-bold">{label} Screen</div>
);

const MainScreen = () => {
  const [selectedKey, setSelectedKey] = useState('home');

  let content;
  switch (selectedKey) {
    case 'home':
      content = <HomeBox />;
      break;
    case 'myExam':
      content = <Placeholder label="My Exam" />;
      break;
    case 'shared':
      content = <Placeholder label="Shared with me" />;
      break;
    case 'recent':
      content = <Placeholder label="Recently" />;
      break;
    case 'starred':
      content = <Placeholder label="Starred" />;
      break;
    case 'ai':
      content = <Placeholder label="AI Generate" />;
      break;
    case 'spam':
      content = <Placeholder label="Spam Content" />;
      break;
    case 'trash':
      content = <Placeholder label="Trash Can" />;
      break;
    case 'create':
      content = <Placeholder label="Create New" />;
      break;
    default:
      content = <HomeBox />;
  }

  return (
    <div className="flex">
      <Sidebar activeKey={selectedKey} onSelect={setSelectedKey} />
      <div className="flex-1 min-h-[80vh] p-4">{content}</div>
    </div>
  );
};

export default MainScreen;
