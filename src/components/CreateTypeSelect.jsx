import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "@/assets/icons/person-question-mark-svgrepo-com.svg";
import examIcon from "@/assets/icons/exam-svgrepo-com.svg";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileText } from "lucide-react";
import MultiStepWizard from "./MultiStepWizard";

const CreateTypeSelect = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);

  const handleWizardComplete = (data) => {
    setSelectedType(null);
  };

  const handleWizardBack = () => {
    setSelectedType(null);
  };

  if (selectedType) {
    return (
      <MultiStepWizard
        type={selectedType}
        onComplete={handleWizardComplete}
        onBack={handleWizardBack}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[70vh] p-4">
      <Card className="w-full max-w-4xl shadow-xl border-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-blue-600">
            {t('what_to_create')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center">
            <Card className="w-full md:w-[320px] hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 group">
              <CardContent 
                className="p-8 flex flex-col items-center justify-center min-h-[320px]"
                onClick={() => setSelectedType("question")}
              >
                <div className="w-32 h-32 mb-6 flex items-center justify-center bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <img src={personIcon} alt="Question" className="w-20 h-20" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {t('question')}
                </h3>
                <p className="text-slate-600 text-center mt-2 text-sm">
                  {t('create_question_description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-[320px] hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-green-300 group">
              <CardContent 
                className="p-8 flex flex-col items-center justify-center min-h-[320px]"
                onClick={() => setSelectedType("exam")}
              >
                <div className="w-32 h-32 mb-6 flex items-center justify-center bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <img src={examIcon} alt="Exam" className="w-20 h-20" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                  {t('exam')}
                </h3>
                <p className="text-slate-600 text-center mt-2 text-sm">
                  {t('create_exam_description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTypeSelect;