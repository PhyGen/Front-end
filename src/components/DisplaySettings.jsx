import React, { useState } from 'react';
import { Moon, Type } from "lucide-react";
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const DisplaySettings = () => {
  const { theme, changeTheme, shouldApplyDarkMode } = useTheme();
  const [compactMode, setCompactMode] = useState('off');
  const { t } = useTranslation();

  const handleDarkModeChange = (e) => {
    if (shouldApplyDarkMode) {
      changeTheme(e.target.value);
    }
  };

  const handleCompactModeChange = (e) => {
    setCompactMode(e.target.value);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] shadow-2xl w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <Moon className="w-8 h-8 text-blue-500 mr-2" />
        <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e4e6eb]">{t('display_accessibility')}</h3>
      </div>

      {/* Dark Mode */}
      <div className={`mb-6 p-4 rounded-xl border ${shouldApplyDarkMode ? 'bg-slate-50 dark:bg-neutral-800' : 'bg-slate-100'} flex items-center gap-4`}>
        <Moon className={`w-10 h-10 ${shouldApplyDarkMode ? 'text-blue-400 dark:text-blue-300' : 'text-gray-400'}`} />
        <div className="flex-1">
          <div className="font-semibold text-lg text-slate-800 dark:text-white mb-1">{t('dark_mode')}</div>
          <div className="text-sm text-slate-500 dark:text-neutral-300 mb-2">
            {shouldApplyDarkMode ? t('dark_mode_desc') : 'Dark mode is not available for admin and moderator accounts'}
          </div>
          <div className="flex gap-4">
            <label className={`flex items-center gap-2 ${shouldApplyDarkMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
              <input 
                type="radio" 
                name="darkMode" 
                value="light" 
                checked={theme === 'light'} 
                onChange={handleDarkModeChange} 
                className="accent-blue-500"
                disabled={!shouldApplyDarkMode}
              />
              {t('off')}
            </label>
            <label className={`flex items-center gap-2 ${shouldApplyDarkMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
              <input 
                type="radio" 
                name="darkMode" 
                value="dark" 
                checked={theme === 'dark'} 
                onChange={handleDarkModeChange} 
                className="accent-blue-500"
                disabled={!shouldApplyDarkMode}
              />
              {t('on')}
            </label>
            <label className={`flex items-center gap-2 ${shouldApplyDarkMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
              <input 
                type="radio" 
                name="darkMode" 
                value="auto" 
                checked={theme === 'auto'} 
                onChange={handleDarkModeChange} 
                className="accent-blue-500"
                disabled={!shouldApplyDarkMode}
              />
              {t('auto')}
            </label>
          </div>
        </div>
      </div>

      {/* Compact Mode */}
      <div className="p-4 rounded-xl border bg-slate-50 dark:bg-neutral-800 flex items-center gap-4">
        <Type className="w-10 h-10 text-indigo-400 dark:text-indigo-300" />
        <div className="flex-1">
          <div className="font-semibold text-lg text-slate-800 dark:text-white mb-1">{t('compact_mode')}</div>
          <div className="text-sm text-slate-500 dark:text-neutral-300 mb-2">
            {t('compact_mode_desc')}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="compactMode" value="off" checked={compactMode === 'off'} onChange={handleCompactModeChange} className="accent-indigo-500" />
              {t('off')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="compactMode" value="on" checked={compactMode === 'on'} onChange={handleCompactModeChange} className="accent-indigo-500" />
              {t('on')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings; 