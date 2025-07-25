import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="
      flex items-center justify-center
      bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60
      dark:bg-[#242526] dark:backdrop-blur
      p-4 shadow-sm border-b rounded-b-2xl
    ">
      <div className="flex gap-6">
        {[
          'about',
          'feature',
          'contact',
          'statistic',
          'question_bank'
        ].map((key) => (
          <Button
            key={key}
            variant="ghost"
            className="
              text-slate-600 dark:text-white font-medium
              hover:bg-[#1965fe] hover:text-white
              dark:hover:bg-[#3a3b3c] dark:hover:text-white
            "
          >
            {t(key)}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
