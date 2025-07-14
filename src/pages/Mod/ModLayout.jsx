import React, { useState } from 'react';
import ModSidebar from './ModSidebar';
import ModContent from './ModContent';

const ModLayout = () => {
  const [selected, setSelected] = useState('grade');
  
  console.log('ModLayout rendering with selected:', selected);
  
  const handleSelect = (newSelected) => {
    console.log('ModLayout handleSelect called with:', newSelected);
    setSelected(newSelected);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ModSidebar selected={selected} onSelect={handleSelect} />
      <div className="flex-1 p-6">
        <ModContent selected={selected} />
      </div>
    </div>
  );
};

export default ModLayout; 