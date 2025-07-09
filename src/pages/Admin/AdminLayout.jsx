import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminContent from './AdminContent';

const AdminLayout = () => {
  const [selected, setSelected] = useState('grade');
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminSidebar selected={selected} onSelect={setSelected} />
      <div className="flex-1 p-6">
        <AdminContent selected={selected} />
      </div>
    </div>
  );
};

export default AdminLayout; 