import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

import ukFlag from '../assets/icons/uk_flag.svg';
import vnFlag from '../assets/icons/vn_flag.svg';

const languageConfig = {
  en: { name: 'English', flag: ukFlag, next: 'vi' },
  vi: { name: 'Tiếng Việt', flag: vnFlag, next: 'en' },
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLangCode = i18n.language.startsWith('vi') ? 'vi' : 'en';
  const currentLanguage = languageConfig[currentLangCode];

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLanguage.next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full w-8 h-8">
      <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-6 h-6 rounded-full object-cover" />
    </Button>
  );
};

export default LanguageSwitcher; 