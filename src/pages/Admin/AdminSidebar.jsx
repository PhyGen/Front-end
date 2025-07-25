import React from 'react';

const sidebarItems = [
  { key: 'account', label: 'Account' },
  { key: 'setting', label: 'Setting' },
];

const AdminSidebar = ({ selected, onSelect }) => {
  return (
    <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-blue-700">Admin</h2>
      <nav className="flex flex-col gap-2">
        {sidebarItems.map(item => (
          <button
            key={item.key}
            className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${selected === item.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-700'}`}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 