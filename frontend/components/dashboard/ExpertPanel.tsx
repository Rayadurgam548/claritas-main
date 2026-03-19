'use client';

import { useState } from 'react';
import { Scale, ShieldAlert, Building2, Landmark, BrainCircuit, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AgentChatModal } from './AgentChatModal';

interface ExpertPanelProps {
  activeDocumentId?: string;
}

const AGENTS = [
  {
    id: 'lawyer',
    name: 'Senior Legal Counsel',
    icon: <Scale className="w-7 h-7 text-white" />,
    theme: 'bg-gradient-to-br from-indigo-600 to-indigo-900 border-indigo-500/30',
    description: 'Specializes in contract liabilities, indemnification clauses, and pure legal risk exposure.',
    highlight: 'Legal Risk Analysis'
  },
  {
    id: 'police',
    name: 'Criminal Investigator',
    icon: <ShieldAlert className="w-7 h-7 text-white" />,
    theme: 'bg-gradient-to-br from-red-600 to-red-900 border-red-500/30',
    description: 'Scans for illegal activities, fraud indicators, and penal code violations hidden in text.',
    highlight: 'Criminal Implications'
  },
  {
    id: 'municipal',
    name: 'Municipal Officer',
    icon: <Building2 className="w-7 h-7 text-white" />,
    theme: 'bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-500/30',
    description: 'Enforces local zoning laws, property regulations, building codes, and civic compliance.',
    highlight: 'Civic Compliance'
  },
  {
    id: 'bank',
    name: 'Financial Auditor',
    icon: <Landmark className="w-7 h-7 text-white" />,
    theme: 'bg-gradient-to-br from-amber-500 to-amber-800 border-amber-500/30',
    description: 'Evaluates extreme monetary risk, loan defaults, hidden interest traps, and ROI damage.',
    highlight: 'Financial Traps'
  },
  {
    id: 'core',
    name: 'Core Analyzer Brain',
    icon: <BrainCircuit className="w-7 h-7 text-white" />,
    theme: 'bg-gradient-to-br from-blue-600 to-blue-900 border-blue-500/30',
    description: 'Provides general summaries, high-level intent, and routes context to specialized agents.',
    highlight: 'General Strategy'
  }
];

export function ExpertPanel({ activeDocumentId }: ExpertPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-y-auto">
      <div className="max-w-[1200px] w-full mx-auto p-4 md:p-8 pt-10">
        
        <div className="mb-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-primary/20 flex flex-center mx-auto mb-4 border border-primary/30 shadow-glow">
             <div className="m-auto"><Users className="w-8 h-8 text-primary" /></div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Multi-Agent Insights</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            Consult our panel of highly specialized AI agents. Each persona operates in strict domain isolation, utilizing compressed context retrieval for lightning-fast, highly accurate insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={agent.id} 
              onClick={() => setSelectedAgent(agent)}
              className="bg-card border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-border/80 transition-all cursor-pointer flex flex-col h-full group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 ${agent.theme}`} />
              
              <div className="flex items-start gap-5 mb-5 mt-2">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${agent.theme}`}>
                   {agent.icon}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{agent.highlight}</span>
                 </div>
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed mb-6 flex-1">
                {agent.description}
              </p>

              <button className="w-full py-3 bg-muted/50 text-foreground text-sm font-semibold rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                Consult {agent.name}
              </button>
            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {selectedAgent && (
          <AgentChatModal
            documentId={activeDocumentId || ''}
            agentId={selectedAgent.id}
            agentName={selectedAgent.name}
            agentIcon={selectedAgent.icon}
            agentTheme={selectedAgent.theme}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
