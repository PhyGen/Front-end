import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, changeTheme, shouldApplyDarkMode } = useTheme();
  
  // Ẩn component nếu không nên áp dụng dark mode
  if (!shouldApplyDarkMode) {
    return null;
  }
  
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    if (theme === 'dark') changeTheme('light');
    else changeTheme('dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8 ml-2">
      {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </Button>
  );
};

export default ThemeSwitcher; 