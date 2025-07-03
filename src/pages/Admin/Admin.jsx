import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/landing');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1 className="text-5xl font-bold text-red-600">Admin Page</h1>
      <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold">Log out</Button>
    </div>
  );
};

export default Admin; 