'use client';

import { useState, useEffect } from 'react';
import { LegalAPI, DocumentData } from '@/app/lib/api';
import { getUser, logout } from '@/app/lib/auth';
import { ScrollText, History, Clock, CheckCircle, FileText, Settings, Moon, Sun, Monitor, Trash2, LogOut, Home, MessageSquare, Folder, Calendar, BookOpen, Users } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useTheme } from './ThemeProvider';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setUser(getUser());
    // Fetch recent documents
    const fetchDocs = async () => {
      try {
        const res = await LegalAPI.getDocuments();
        if (res.success) {
          setDocuments(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };
    fetchDocs();
  }, []);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: <Home className="w-4 h-4" /> },
    { id: 'documents', label: t.documents, icon: <Folder className="w-4 h-4" /> },
    { id: 'ai', label: t.ai_assistant, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'expertPanel', label: t.expert_panel, icon: <Users className="w-4 h-4" /> },
    { id: 'deadlines', label: t.deadlines, icon: <Calendar className="w-4 h-4" /> },
    { id: 'glossary', label: t.glossary, icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 h-screen border-r border-border bg-card flex flex-col justify-between shadow-sm z-20">
      <div className="p-6 overflow-y-auto hidden-scrollbar">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <ScrollText className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">CLARITAS</h1>
        </div>

        <div className="space-y-8">
          {/* Main Navigation */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t.settings}
            </h2>
            <div className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className={cn("transition-colors", activeTab === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")}>
                    {item.icon}
                  </div>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Documents Mini List */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-4 h-4" /> {t.recent}
            </h2>
            <div className="space-y-1">
              {documents.length === 0 ? (
                <p className="text-xs text-muted-foreground italic px-3">No recent documents</p>
              ) : (
                documents.slice(0, 5).map(doc => (
                  <button 
                    key={doc.id}
                    onClick={() => onTabChange('documents')}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-3 group relative"
                  >
                    <FileText className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium truncate text-muted-foreground group-hover:text-foreground flex-1">
                      {doc.filename}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-border bg-card">
        {user && (
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4 bg-muted/30 p-1 rounded-lg border border-border/50">
          <button onClick={() => setTheme('light')} className={cn("flex-1 flex justify-center p-1.5 rounded-md hover:bg-background transition-colors", theme === 'light' && "bg-background text-primary shadow-sm")}>
            <Sun className="w-4 h-4" />
          </button>
          <button onClick={() => setTheme('dark')} className={cn("flex-1 flex justify-center p-1.5 rounded-md hover:bg-background transition-colors", theme === 'dark' && "bg-background text-primary shadow-sm")}>
            <Moon className="w-4 h-4" />
          </button>
          <button onClick={() => setTheme('system')} className={cn("flex-1 flex justify-center p-1.5 rounded-md hover:bg-background transition-colors", theme === 'system' && "bg-background text-primary shadow-sm")}>
            <Monitor className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" /> {t.settings}
          </button>
          <button onClick={logout} className="flex items-center text-sm font-medium text-danger hover:text-danger/80 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
