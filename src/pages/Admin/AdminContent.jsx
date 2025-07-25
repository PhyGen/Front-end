import React from 'react';
import AdminSetting from './AdminSetting';
import AdminAccount from './AdminAccount';
import { useAuth } from '@/context/AuthContext';
import api from '../../config/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContent = ({ selected }) => {
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selected === 'setting' && user && user.id) {
      setLoading(true);
      api.get(`/users/${user.id}`)
        .then(res => setUserInfo(res.data))
        .catch(() => setUserInfo(null))
        .finally(() => setLoading(false));
    }
  }, [selected, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setUser(null);
    navigate('/signin');
  };

  let content = null;
  if (selected === 'setting') content = <AdminSetting />;
  else if (selected === 'account') content = <AdminAccount />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {content}
    </div>
  );
};

export default AdminContent; 