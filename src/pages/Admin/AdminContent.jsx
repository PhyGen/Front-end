import React from 'react';
import AdminGrade from './AdminGrade';
import AdminSemester from './AdminSemester';
import AdminChapter from './AdminChapter';
import AdminLesson from './AdminLesson';
import AdminSetting from './AdminSetting';
import AdminQuestion from './AdminQuestion';
import AdminAccount from './AdminAccount';
import AdminTextbook from './AdminTextbook';
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
  if (selected === 'grade') content = <AdminGrade />;
  else if (selected === 'semester') content = <AdminSemester />;
  else if (selected === 'chapter') content = <AdminChapter />;
  else if (selected === 'lesson') content = <AdminLesson />;
  else if (selected === 'textbook') content = <AdminTextbook />;
  else if (selected === 'setting') content = <AdminSetting />;
  else if (selected === 'question') content = <AdminQuestion />;
  else if (selected === 'account') content = <AdminAccount />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {content}
    </div>
  );
};

export default AdminContent; 