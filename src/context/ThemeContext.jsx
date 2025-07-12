import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Kiểm tra xem có nên áp dụng dark mode hay không
  const shouldApplyDarkMode = () => {
    // Luôn áp dụng cho trang signin và signup
    if (location.pathname === '/signin' || location.pathname === '/signup') {
      return true;
    }
    
    // Chỉ áp dụng cho user role (roleId = "1")
    if (user && user.roleId === "1") {
      return true;
    }
    
    // Không áp dụng cho admin (roleId = "2") và moderator (roleId = "3")
    return false;
  };

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return 'auto';
  });

  // Effect cho auto theme
  useEffect(() => {
    if (theme !== 'auto' || !shouldApplyDarkMode()) return;
    
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      if (media.matches && shouldApplyDarkMode()) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    media.addEventListener('change', handler);
    handler();
    return () => media.removeEventListener('change', handler);
  }, [theme, location.pathname, user]);

  // Effect chính để áp dụng theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    
    // Nếu không nên áp dụng dark mode, luôn set về light
    if (!shouldApplyDarkMode()) {
      root.classList.remove('dark');
      return;
    }
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'auto') {
      // Đã xử lý ở effect trên
    }
  }, [theme, location.pathname, user]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    changeTheme,
    shouldApplyDarkMode: shouldApplyDarkMode(),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 