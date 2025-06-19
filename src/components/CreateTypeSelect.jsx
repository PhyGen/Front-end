import React from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "@/assets/icons/person-question-mark-svgrepo-com.svg";
import examIcon from "@/assets/icons/exam-svgrepo-com.svg";

const CreateTypeSelect = ({ onSelect }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh]">
    <div className="bg-gray-50 rounded-2xl p-16 shadow-xl w-full max-w-[90vw] min-h-[80vh] flex flex-col items-center justify-center">
      <h2 className="text-5xl font-extrabold mb-16 text-center">What do you want to create</h2>
      <div className="flex gap-20 w-full justify-center">
        <button
          className="flex flex-col items-center border-2 border-gray-200 rounded-2xl p-16 hover:shadow-2xl transition w-[320px] min-h-[320px]"
          onClick={() => onSelect("question")}
        >
          <img src={personIcon} alt="Question" className="w-32 h-32 mb-8" />
          <span className="text-3xl font-bold">Question</span>
        </button>
        <button
          className="flex flex-col items-center border-2 border-gray-200 rounded-2xl p-16 hover:shadow-2xl transition w-[320px] min-h-[320px]"
          onClick={() => onSelect("exam")}
        >
          <img src={examIcon} alt="Exam" className="w-32 h-32 mb-8" />
          <span className="text-3xl font-bold">Exam</span>
        </button>
      </div>
    </div>
  </div>
);

export default CreateTypeSelect;