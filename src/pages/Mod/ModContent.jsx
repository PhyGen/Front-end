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
import ModSetting from './ModSetting';
import ModQuestion from './ModQuestion';
import ModTextbook from './ModTextbook';
import PhyGenVideo from './PhyGenVideo';

function decodeId(encodedId) {
  const bytes = Uint8Array.from(atob(encodedId), c => c.charCodeAt(0));
  return new DataView(bytes.buffer).getInt32(0, true);
}

const ModContent = ({ selected }) => {
  console.log('ModContent rendering with selected:', selected);
  
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
  else if (selected === 'textbook') content = <ModTextbook />;
  // else if (selected === 'question') content = <ModQuestion />;
  else if (selected === 'setting') content = <ModSetting />;
  else if (selected === 'question') content = <ModQuestion />;
  else if (selected === 'pgvideo') content = <PhyGenVideo />;

  console.log('Content to render:', content);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {content || (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No content found for selected: {selected}</p>
          <p>Available options: grade, semester, chapter, lesson, question, setting</p>
        </div>
      )}
    </div>
  );
};

export default ModContent; 