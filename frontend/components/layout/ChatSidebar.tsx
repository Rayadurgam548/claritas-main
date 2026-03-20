'use client';

import { useState } from 'react';
import { LegalAPI } from '@/app/lib/api';
import { MessageSquare, Send, Sparkles, Loader2, Info } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

interface ChatSidebarProps {
  documentId?: string | null;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function ChatSidebar({ documentId }: ChatSidebarProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: t.welcome_chat
    }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: t.welcome_chat
      }
    ]);
    setQuery('');
  }, [documentId, t.welcome_chat]);

  const predefinedQuestions = [
    t.termination_rights_q,
    t.hidden_fees_q,
    t.auto_renew_q
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || !documentId) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await LegalAPI.chat(documentId, text, 'document', language);
      const aiMessage: Message = { role: 'ai', content: response.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'ai', content: t.chat_error };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-80 h-screen border-l border-border bg-card flex flex-col shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          {t.legal_chat}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t.chat_desc}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!documentId && (
          <div className="bg-warning/10 text-warning-foreground p-3 rounded-lg border border-warning/20 text-sm flex gap-2">
             <Info className="w-4 h-4 shrink-0 mt-0.5 text-warning" />
             <p>{t.upload_first_chat}</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn(
                "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground ml-auto rounded-tr-sm" 
                  : "bg-muted text-foreground mr-auto rounded-tl-sm border border-border"
              )}
            >
              {msg.content}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted text-foreground mr-auto rounded-2xl rounded-tl-sm p-3 w-fit"
            >
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border bg-card">
        {messages.length === 1 && documentId && (
          <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
            {predefinedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-muted hover:bg-muted/80 text-xs rounded-full border border-border transition-colors text-muted-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!documentId || isLoading}
            placeholder={documentId ? t.ask_question_placeholder : t.upload_first_placeholder}
            className="w-full pl-4 pr-12 py-3 bg-muted border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!documentId || !query.trim() || isLoading}
            className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
