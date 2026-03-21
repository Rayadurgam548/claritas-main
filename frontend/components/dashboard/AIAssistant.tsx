'use client';

import { useState } from 'react';
import { LegalAPI } from '@/app/lib/api';
import { MessageSquare, Send, Sparkles, FileText, Scale, Lightbulb, Upload, Volume2, VolumeX, Pause, ShieldAlert } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export function AIAssistant({ documentId }: { documentId?: string | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'general' | 'document' | 'terminology'>(documentId ? 'document' : 'general');
  const [localDocumentId, setLocalDocumentId] = useState<string | null>(documentId || null);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<number | null>(null);
  const { language, isMuted } = useLanguage();
  const t = translations[language];

  const speakMessage = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) return;
    
    if (currentlySpeaking === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : language === 'Telugu' ? 'te-IN' : 'en-US';
    
    utterance.onstart = () => setCurrentlySpeaking(index);
    utterance.onend = () => setCurrentlySpeaking(null);
    utterance.onerror = () => setCurrentlySpeaking(null);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setQuery('');
    setIsLoading(true);
    try {
      const response = await LegalAPI.chat(localDocumentId, text, chatMode, language);
      console.log("DEBUG: AIAssistant raw response:", response);
      
      const newAiMsg = { 
        role: 'ai', 
        content: response.answer || "No response text found",
        confidence: response.confidence,
        riskFlags: response.risk_flags,
        disclaimer: response.disclaimer
      };
      setMessages(prev => [...prev, newAiMsg]);
      
      // Save to localStorage for dashboard
      const stored = typeof window !== 'undefined' ? localStorage.getItem('lex_queries') : null;
      const queries = stored ? JSON.parse(stored) : [];
      queries.push({ text, time: 'Just now', timestamp: new Date().toISOString() });
      if (typeof window !== 'undefined') {
        localStorage.setItem('lex_queries', JSON.stringify(queries.slice(-50)));
      }

      // TTS hook
      if (!isMuted && 'speechSynthesis' in window) {
        speakMessage(response.answer || "No response text found", messages.length + 1);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col flex-1 relative">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 h-full py-10 w-full animate-in fade-in zoom-in duration-500">
               <div className="w-16 h-16 rounded-2xl bg-[#1a2333] flex items-center justify-center mb-6 shadow-glow border border-primary/20">
                 <Sparkles className="w-8 h-8 text-[#4e8df5]" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">{t.how_help}</h3>
               <p className="text-muted-foreground max-w-lg text-center text-sm mb-10 leading-relaxed">
                 {t.how_help_desc}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                 <button onClick={() => { setChatMode('document'); document.getElementById('upload-input')?.click(); }} className="p-5 text-left bg-card rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <FileText className="w-6 h-6 text-[#4e8df5] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">{t.analyze_contract}</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">{t.upload_document}</p>
                   <input type="file" id="upload-input" className="hidden" />
                 </button>
                 
                 <button onClick={() => { setChatMode('terminology'); handleSend("Explain legal terminology"); }} className="p-5 text-left bg-card rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <Scale className="w-6 h-6 text-[#9333ea] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">{t.legal_terminology}</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">{t.glossary}</p>
                 </button>
                 
                 <button onClick={() => { setChatMode('general'); handleSend("I need general legal advice"); }} className="p-5 text-left bg-card rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <Lightbulb className="w-6 h-6 text-[#00F5D4] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">{t.legal_advice}</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">{t.expert_panel}</p>
                 </button>
               </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1 w-full pb-32">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-3xl shadow-sm text-[15px] leading-relaxed relative group/msg transition-all flex flex-col gap-3",
                      msg.role === 'user'
                        ? "bg-[#4e8df5] text-white rounded-br-sm"
                        : "bg-card border border-border/50 text-foreground rounded-bl-sm pb-10"
                    )}>
                      {msg.role === 'ai' && msg.confidence && (
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                            msg.confidence === 'High' ? "bg-success/10 text-success border-success/20" :
                            msg.confidence === 'Medium' ? "bg-warning/10 text-warning border-warning/20" : "bg-danger/10 text-danger border-danger/20"
                          )}>
                             Confidence: {msg.confidence}
                          </span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      
                      {msg.role === 'ai' && msg.riskFlags && msg.riskFlags.length > 0 && (
                        <div className="space-y-2 mt-2">
                           <p className="text-xs font-bold text-danger flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Identified Risks:</p>
                           <div className="flex flex-wrap gap-2">
                             {msg.riskFlags.map((flag: string, fIdx: number) => (
                               <span key={fIdx} className="bg-danger/5 border border-danger/10 text-danger text-[10px] px-2 py-1 rounded-lg">
                                 {flag}
                               </span>
                             ))}
                           </div>
                        </div>
                      )}

                      {msg.role === 'ai' && msg.disclaimer && (
                        <p className="text-[10px] text-muted-foreground italic mt-2 border-t border-border/30 pt-2">
                          {msg.disclaimer}
                        </p>
                      )}
                      
                      {msg.role === 'ai' && (
                        <button 
                          onClick={() => speakMessage(msg.content, idx)}
                          className={cn(
                            "absolute bottom-2 right-2 p-1.5 rounded-xl bg-muted/50 border border-border/50 text-primary transition-all hover:bg-muted hover:scale-110",
                            currentlySpeaking === idx ? "animate-pulse border-primary" : "opacity-40 group-hover/msg:opacity-100"
                          )}
                          title="Speak this message"
                        >
                          {currentlySpeaking === idx ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                    <div className="bg-card border border-border/50 text-foreground rounded-3xl rounded-bl-sm p-4 w-fit flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#4e8df5] animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-[#4e8df5] animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-[#4e8df5] animate-pulse delay-150"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
      
      {/* Bottom Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-6 pt-0 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col items-center pointer-events-auto">
          <div className="mb-4 text-xs font-medium text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border/50">
            {t.demo_mode}
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
            className="w-full relative flex items-center bg-card border border-border/50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#4e8df5] transition-all group"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              placeholder={t.ask_question}
              className="w-full px-5 py-4 bg-transparent border-none text-[15px] focus:ring-0 outline-none disabled:opacity-50"
            />
            <div className="flex gap-2 mr-3 shrink-0">
               <button 
                 type="button" 
                 onClick={() => {
                   if (!('webkitSpeechRecognition' in window)) {
                     alert('Speech recognition is not supported in this browser.');
                     return;
                   }
                   //@ts-ignore
                   const recognition = new webkitSpeechRecognition();
                   recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : language === 'Telugu' ? 'te-IN' : 'en-US';
                   recognition.onstart = () => setIsListening(true);
                   recognition.onend = () => setIsListening(false);
                   recognition.onresult = (event: any) => {
                     const transcript = event.results[0][0].transcript;
                     setQuery(transcript);
                   };
                   recognition.start();
                 }} 
                 className={cn("p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50", isListening && "text-danger animate-pulse")}
               >
                 <MessageSquare className="w-4 h-4" />
               </button>
               <button type="button" onClick={() => document.getElementById('chat-upload-input')?.click()} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                 <Upload className="w-4 h-4" />
               </button>
               <input 
                 type="file" 
                 id="chat-upload-input" 
                 className="hidden" 
                 onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsLoading(true);
                    setMessages(prev => [...prev, { role: 'user', content: `[Uploaded File: ${file.name}]` }]);
                    try {
                      const res = await LegalAPI.uploadDocument(file);
                      if (res && res[0]) {
                         const newDocId = res[0].id;
                         setLocalDocumentId(newDocId);
                         setMessages(prev => [...prev, { role: 'ai', content: t.uploaded_msg.replace('${file.name}', file.name) }]);
                         LegalAPI.analyzeDocument(newDocId, language).catch(console.error);
                      }
                    } catch(err) {
                      setMessages(prev => [...prev, { role: 'ai', content: `Failed to process ${file.name}.` }]);
                    } finally {
                      setIsLoading(false);
                      if (e.target) e.target.value = '';
                    }
                 }}
               />
               <button
                 type="submit"
                 disabled={!query.trim() || isLoading}
                 className="p-2 bg-[#4e8df5] text-white rounded-lg disabled:opacity-50 hover:bg-[#4e8df5]/90 transition-all shadow-sm"
               >
                 <Send className="w-4 h-4" />
               </button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
}
