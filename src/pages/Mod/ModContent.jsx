import React from 'react';
import ModGrade from './ModGrade';
import ModSemester from './ModSemester';
import ModChapter from './ModChapter';
import ModLesson from './ModLesson';
// import ModQuestion from './ModQuestion';
import { useAuth } from '@/context/AuthContext';
import api from '../../config/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModContent = ({ selected }) => {
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
  if (selected === 'grade') content = <ModGrade />;
  else if (selected === 'semester') content = <ModSemester />;
  else if (selected === 'chapter') content = <ModChapter />;
  else if (selected === 'lesson') content = <ModLesson />;
  // else if (selected === 'question') content = <ModQuestion />;
  else if (selected === 'setting') content = (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Cài đặt tài khoản</h2>
      {loading ? (
        <div>Đang tải thông tin...</div>
      ) : userInfo ? (
        <div className="mb-6">
          <div className="mb-2"><b>ID:</b> {userInfo.id}</div>
          <div className="mb-2"><b>Email:</b> {userInfo.email}</div>
          <div className="mb-2"><b>Họ tên:</b> {userInfo.fullName || userInfo.name || '-'}</div>
          <div className="mb-2"><b>Vai trò:</b> {userInfo.roleName || userInfo.role || '-'}</div>
        </div>
      ) : (
        <div>Không lấy được thông tin người dùng.</div>
      )}
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold mt-4"
      >
        Đăng xuất
      </button>
    </div>
  );
  else content = null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {content}
    </div>
  );
};

export default ModContent; 