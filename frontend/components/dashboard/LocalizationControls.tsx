'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Languages, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface LocalizationControlsProps {
  onLanguageChange?: (lang: string) => void;
}

export function LocalizationControls({ onLanguageChange }: LocalizationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu'];

  const handleLangSelect = (lang: string) => {
    setLanguage(lang as any);
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const toggleAudio = () => {
    // Mock audio play
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000); // Stop after mock 3 seconds
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-xl transition-colors text-sm font-medium"
        >
          <Languages className="w-4 h-4 text-muted-foreground" />
          {language}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 p-1"
            >
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangSelect(lang)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted flex items-center justify-between transition-colors"
                >
                  {lang}
                  {language === lang && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={toggleAudio}
        className={cn(
          "p-2.5 rounded-xl border transition-colors flex items-center justify-center group",
          isPlaying 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Listen to summary"
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
