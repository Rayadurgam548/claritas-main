'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, X, Loader2, ShieldCheck, ShieldAlert, BadgeInfo } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface AgentChatModalProps {
  documentId: string;
  agentId: string;
  agentName: string;
  agentIcon: React.ReactNode;
  agentTheme: string;
  onClose: () => void;
}

export function AgentChatModal({ documentId, agentId, agentName, agentIcon, agentTheme, onClose }: AgentChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: `Hello! I am the ${agentName}. I have reviewed the compressed context of this document. What specific questions do you have about ${agentId === 'lawyer' ? 'legal liabilities' : agentId === 'police' ? 'criminal implications' : agentId === 'municipal' ? 'civic compliance' : agentId === 'bank' ? 'financial risks' : 'this document'}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const predefinedResponses: Record<string, string[]> = {
        lawyer: [
          "Based on the predefined problem statement: The indemnification clause holds severe one-sided liability. I strongly recommend negotiating a mutual cap.",
          "Looking at the predefined legal problem: There is an unlimited liability risk hidden in Section 4. This is a severe legal trap."
        ],
        police: [
          "Based on the predefined problem statement: The transaction structures vaguely mimic money laundering indicators. Proceed with extreme caution.",
          "According to the problem statement: There are severe penal code violations if these funds are transferred implicitly. I see criminal exposure."
        ],
        municipal: [
          "Based on the predefined problem statement: The property does not comply with local zoning ordinances for commercial use. This risks massive fines.",
          "Looking at the predefined issue: This violates city code regulations regarding unpermitted structural modifications."
        ],
        bank: [
          "Based on the predefined problem statement: The hidden interest rate compounds daily, leading to an incredibly high risk of loan default.",
          "According to the financial breakdown: The ROI calculations are entirely unviable based on these payment terms. Massive financial exposure."
        ],
        core: [
          "Based on the predefined problem statement: Overall, the document is heavily skewed against you. I recommend escalating this to the specialized agents.",
          "Looking at the core metrics: This contract contains multiple hidden clauses that require your immediate attention."
        ]
      };

      const responses = predefinedResponses[agentId] || predefinedResponses.core;
      // Cycle through responses consistently based on array length to give variety
      const mockResponse = responses[messages.length % responses.length];

      setMessages(prev => [...prev, { role: 'agent', content: mockResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-card border border-border/50 rounded-3xl shadow-2xl flex flex-col h-[700px] max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={cn("p-4 md:p-6 flex items-center justify-between border-b shrink-0", agentTheme)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex flex-center shadow-inner blur-[0.5px]">
               {/* Note: In a real component, absolute center the icon */}
               <div className="m-auto">{agentIcon}</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {agentName}
              </h2>
              <p className="text-xs text-white/80 font-medium">Strict Domain Isolation Mode Enabled</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/10 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex items-start gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
               <div className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                 msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border border-border text-muted-foreground"
               )}>
                 {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={cn(
                 "px-5 py-3.5 rounded-2xl max-w-[80%] text-[15px] leading-relaxed",
                 msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/50 rounded-tl-sm shadow-sm"
               )}>
                 {msg.content}
               </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center shrink-0">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="px-5 py-4 rounded-2xl bg-card border border-border/50 shadow-sm flex gap-2 items-center">
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask the ${agentName}...`}
              className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors shadow-glow"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
