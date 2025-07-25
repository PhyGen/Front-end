import React, { useState, useEffect } from 'react';
import ModSidebar from './ModSidebar';
import ModContent from './ModContent';
import { useLocation, useNavigate } from 'react-router-dom';

const ModLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split('/')[2] || 'grade';
  
  console.log('ModLayout rendering with selected:', section);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedParam = searchParams.get('selected');
    const questionIdParam = searchParams.get('questionId');
    
    if (selectedParam) {
      setSelected(selectedParam);
    }
    
    // Store questionId in sessionStorage for PhyGenVideo to access
    if (questionIdParam) {
      sessionStorage.setItem('selectedQuestionId', questionIdParam);
    }
  }, [location.search]);
  
  const handleSelect = (newSelected) => {
    navigate(`/mod/${newSelected}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ModSidebar selected={section} onSelect={handleSelect} />
      <div className="flex-1 p-6">
        <ModContent selected={section} />
      </div>
    </div>
  );
};

export default ModLayout; 