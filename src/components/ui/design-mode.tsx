import React, { createContext, useContext, useState } from 'react';
import { Button } from './button';
import { Settings } from 'lucide-react';

interface DesignModeContextType {
  isDesignMode: boolean;
  toggleDesignMode: () => void;
}

const DesignModeContext = createContext<DesignModeContextType | undefined>(undefined);

export const useDesignMode = () => {
  const context = useContext(DesignModeContext);
  if (!context) {
    throw new Error('useDesignMode must be used within a DesignModeProvider');
  }
  return context;
};

interface DesignModeProviderProps {
  children: React.ReactNode;
}

export const DesignModeProvider: React.FC<DesignModeProviderProps> = ({ children }) => {
  const [isDesignMode, setIsDesignMode] = useState(false);

  const toggleDesignMode = () => {
    setIsDesignMode(!isDesignMode);
  };

  return (
    <DesignModeContext.Provider value={{ isDesignMode, toggleDesignMode }}>
      {children}
    </DesignModeContext.Provider>
  );
};

export const DesignModeToggle: React.FC = () => {
  const { isDesignMode, toggleDesignMode } = useDesignMode();

  return (
    <Button
      variant={isDesignMode ? "default" : "outline"}
      size="sm"
      onClick={toggleDesignMode}
      className="fixed top-4 right-4 z-50"
    >
      <Settings className="w-4 h-4 mr-2" />
      {isDesignMode ? "Exit Design" : "Design Mode"}
    </Button>
  );
};