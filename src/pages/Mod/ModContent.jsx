import React from 'react';
import ModGrade from './ModGrade';
import ModSemester from './ModSemester';
import ModChapter from './ModChapter';
import ModLesson from './ModLesson';
// import ModQuestion from './ModQuestion';

const ModContent = ({ selected }) => {
  let content = null;
  if (selected === 'grade') content = <ModGrade />;
  else if (selected === 'semester') content = <ModSemester />;
  else if (selected === 'chapter') content = <ModChapter />;
  else if (selected === 'lesson') content = <ModLesson />;
  // else if (selected === 'question') content = <ModQuestion />;
  else content = null;

  return (
    <div className="max-w-4xl mx-auto">
      {content}
    </div>
  );
};

export default ModContent; 