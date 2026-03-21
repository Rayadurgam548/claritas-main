import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('English');
  const [isMuted, setIsMuted] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lex_language') as Language : null;
    const savedMute = typeof window !== 'undefined' ? localStorage.getItem('lex_muted') === 'true' : false;
    
    if (saved && ['English', 'Hindi', 'Tamil', 'Telugu'].includes(saved)) {
      setLanguage(saved);
    }
    setIsMuted(savedMute);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lex_language', lang);
    }
  };

  const handleSetMuted = (muted: boolean) => {
    setIsMuted(muted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lex_muted', muted.toString());
      if (muted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      isMuted, 
      setIsMuted: handleSetMuted 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
