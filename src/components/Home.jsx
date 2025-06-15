import React from 'react';
import workTypeIcon from '../assets/icons/work-type-svgrepo-com.svg';
import personIcon from '../assets/icons/person-outline-svgrepo-com.svg';
import scheduleIcon from '../assets/icons/schedule-svgrepo-com.svg';
import locationIcon from '../assets/icons/location-svgrepo-com.svg';
import searchIcon from '../assets/icons/search.svg';
import questionIcon from '../assets/icons/question-mark-svgrepo-com.svg';
import examIcon from '../assets/icons/exam-svgrepo-com.svg';
import sharedIcon from '../assets/icons/shared-with-me.svg';

const filterButtons = [
  { label: 'Type', icon: workTypeIcon },
  { label: 'Person', icon: personIcon },
  { label: 'Last Modified', icon: scheduleIcon },
  { label: 'Location', icon: locationIcon },
];

const suggestedQuestions = [1, 2, 3, 4];
const suggestedExams = [
  { name: 'The Exam', reason: 'You have upload', owner: '', location: 'My Exam' },
  { name: 'The Exam', reason: 'You have opened often', owner: '', location: 'Shared with me' },
  { name: 'The Exam', reason: 'You opened', owner: '', location: 'John' },
];

const Home = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 max-w-5xl mx-auto my-8">
      <h2 className="text-sky-400 text-3xl font-bold text-center mb-8">Welcome to PhyGen</h2>
      <div className="flex justify-center items-center mb-6">
        <input type="text" placeholder="Search" className="w-80 px-5 py-2 border border-gray-200 rounded-l-full outline-none text-base" />
        <button className="bg-sky-400 px-5 py-2 rounded-r-full hover:bg-sky-500 transition">
          <img src={searchIcon} alt="Search" className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {filterButtons.map(btn => (
          <button key={btn.label} className="flex items-center gap-2 bg-blue-50 rounded-full px-5 py-2 text-gray-700 font-medium hover:bg-sky-100 hover:text-sky-500 transition">
            <img src={btn.icon} alt={btn.label} className="w-5 h-5" />
            {btn.label}
          </button>
        ))}
      </div>
      <div className="mb-8">
        <div className="text-lg font-semibold mb-3 text-gray-700">Suggested Question</div>
        <div className="flex gap-4 flex-wrap">
          {suggestedQuestions.map((_, idx) => (
            <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center min-w-[150px] max-w-[180px] flex-1" key={idx}>
              <img src={questionIcon} alt="Question" className="w-8 h-8 mb-2" />
              <div className="font-semibold">The Question</div>
              <div className="text-gray-500 text-sm mt-1">On shared with me</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-lg font-semibold mb-3 text-gray-700">Suggested Exam</div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-blue-50 rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th className="bg-sky-100 text-sky-500 font-bold py-3 px-4 text-left">Name</th>
                <th className="bg-sky-100 text-sky-500 font-bold py-3 px-4 text-left">Reasons for the proposed document</th>
                <th className="bg-sky-100 text-sky-500 font-bold py-3 px-4 text-left">Owner</th>
                <th className="bg-sky-100 text-sky-500 font-bold py-3 px-4 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {suggestedExams.map((exam, idx) => (
                <tr key={idx} className="border-b last:border-b-0 border-gray-200">
                  <td className="py-3 px-4 flex items-center">
                    <img src={examIcon} alt="Exam" className="w-5 h-5 mr-2" />
                    {exam.name}
                  </td>
                  <td className="py-3 px-4">{exam.reason}</td>
                  <td className="py-3 px-4">
                    <img src={personIcon} alt="Owner" className="w-5 h-5 inline-block mr-2" />
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    {exam.location === 'My Exam' && <img src={examIcon} alt="My Exam" className="w-5 h-5" />} 
                    {exam.location === 'Shared with me' && <img src={sharedIcon} alt="Shared with me" className="w-5 h-5" />} 
                    {exam.location === 'John' && <img src={personIcon} alt="John" className="w-5 h-5" />} 
                    <span>{exam.location}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home; 