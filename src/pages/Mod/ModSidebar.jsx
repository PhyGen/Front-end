import React from 'react';

const sidebarItems = [
  { key: 'grade', label: 'Grade' },
  { key: 'semester', label: 'Semester' },
  { key: 'chapter', label: 'Chapter' },
  { key: 'lesson', label: 'Lesson' },
  { key: 'textbook', label: 'Textbook' },
  { key: 'question', label: 'Question' },
  { key: 'setting', label: 'Setting' },
];

const ModSidebar = ({ selected, onSelect }) => {
  const handleClick = (key) => {
    console.log('Sidebar clicked:', key);
    onSelect(key);
  };

  return (
    <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-blue-700">Moderator</h2>
      <nav className="flex flex-col gap-2">
        {sidebarItems.map(item => (
          <button
            key={item.key}
            className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${selected === item.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-700'}`}
            onClick={() => handleClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ModSidebar; 