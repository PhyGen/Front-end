import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("home");

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