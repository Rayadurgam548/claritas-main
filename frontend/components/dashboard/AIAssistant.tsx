'use client';

import { useState } from 'react';
import { LegalAPI } from '@/app/lib/api';
import { MessageSquare, Send, Sparkles, FileText, Scale, Lightbulb, Upload } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant({ documentId }: { documentId?: string | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setQuery('');
    setIsLoading(true);

    try {
      if (documentId) {
        const response = await LegalAPI.chat(documentId, text);
        setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', content: "General legal advice is simulated here. Please upload a specific document for precise analysis." }]);
          setIsLoading(false);
        }, 1500);
        return;
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      
      <div className="px-8 py-6 border-b border-border/50 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">AI Legal Assistant</h2>
        <p className="text-sm text-muted-foreground">Ask questions about legal documents, terminology, or get guidance on legal matters.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col flex-1 relative">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 h-full py-10 w-full animate-in fade-in zoom-in duration-500">
               <div className="w-16 h-16 rounded-2xl bg-[#1a2333] flex items-center justify-center mb-6 shadow-glow border border-primary/20">
                 <Sparkles className="w-8 h-8 text-[#4e8df5]" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">How can I help you today?</h3>
               <p className="text-muted-foreground max-w-lg text-center text-sm mb-10 leading-relaxed">
                 I can help you understand legal documents, explain terminology, and provide guidance on your legal matters.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                 <button onClick={() => document.getElementById('upload-input')?.click()} className="p-5 text-left bg-[#10141d] rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <FileText className="w-6 h-6 text-[#4e8df5] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">Analyze a Contract</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">Upload and understand your legal documents</p>
                   <input type="file" id="upload-input" className="hidden" />
                 </button>
                 
                 <button onClick={() => handleSend("Explain legal terminology")} className="p-5 text-left bg-[#10141d] rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <Scale className="w-6 h-6 text-[#9333ea] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">Legal Terminology</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">Get clear explanations of legal terms</p>
                 </button>
                 
                 <button onClick={() => handleSend("I need general legal advice")} className="p-5 text-left bg-[#10141d] rounded-2xl border border-border/50 hover:border-[#4e8df5]/50 transition-all group flex flex-col items-start h-[160px]">
                   <Lightbulb className="w-6 h-6 text-[#00F5D4] mb-4" />
                   <h4 className="font-semibold text-foreground mb-2">Legal Advice</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">General guidance on legal matters</p>
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
                      "max-w-[80%] p-4 rounded-3xl shadow-sm text-[15px] leading-relaxed",
                      msg.role === 'user'
                        ? "bg-[#4e8df5] text-white rounded-br-sm"
                        : "bg-[#10141d] border border-border/50 text-foreground rounded-bl-sm"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                    <div className="bg-[#10141d] border border-border/50 text-foreground rounded-3xl rounded-bl-sm p-4 w-fit flex items-center gap-2">
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
            Demo Mode - Responses are simulated for demonstration purposes
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
            className="w-full relative flex items-center bg-[#10141d] border border-border/50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#4e8df5] transition-all group"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Ask a legal question..."
              className="w-full px-5 py-4 bg-transparent border-none text-[15px] focus:ring-0 outline-none disabled:opacity-50"
            />
            <div className="flex gap-2 mr-3 shrink-0">
               <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                 <Upload className="w-4 h-4" />
               </button>
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
