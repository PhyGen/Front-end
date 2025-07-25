import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem('startPage') || 'home';
  });

  return (
    <SidebarContext.Provider value={{
      selectedKey,
      setSelectedKey
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext); 