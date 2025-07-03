import React, { useState } from 'react';
import ModSidebar from './ModSidebar';
import ModContent from './ModContent';

const ModLayout = () => {
  const [selected, setSelected] = useState('grade');
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ModSidebar selected={selected} onSelect={setSelected} />
      <div className="flex-1 p-6">
        <ModContent selected={selected} />
      </div>
    </div>
  );
};

export default ModLayout; 