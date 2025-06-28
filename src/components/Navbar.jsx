import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center justify-center bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 shadow-sm border-b rounded-b-2xl">
      <div className="flex gap-6">
        <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
          {t('about')}
        </Button>
        <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
          {t('feature')}
        </Button>
        <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
          {t('contact')}
        </Button>
        <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
          {t('statistic')}
        </Button>
        <Button variant="ghost" className="text-slate-600 font-medium hover:bg-[#1965fe] hover:text-white">
          {t('question_bank')}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar; 