'use client';

import { useState } from 'react';
import { Book, Search, Filter, ChevronRight, Scale, Shield, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { cn } from '@/app/lib/utils';

const glossaryTerms = [
  { term: 'Force Majeure', definition: 'A clause that frees both parties from liability or obligation when an extraordinary event or circumstance beyond the control of the parties prevents one or both parties from fulfilling their obligations under the contract.', category: 'Contract Law' },
  { term: 'Indemnification', definition: 'To compensate for loss or damage; to provide security for financial reimbursement to an individual in case of a specified loss incurred by the person.', category: 'Liability' },
  { term: 'Non-Disclosure Agreement (NDA)', definition: 'A legally binding contract that establishes a confidential relationship. The party or parties signing the agreement agree that sensitive information they may obtain will not be made available to any others.', category: 'Confidentiality' },
  { term: 'Arbitration', definition: 'A private process where disputing parties agree that one or several individuals can make a decision about the dispute after receiving evidence and hearing arguments.', category: 'Dispute Resolution' },
  { term: 'Breach of Contract', definition: 'A legal cause of action and a type of civil wrong, in which a binding agreement or bargained-for exchange is not honored by one or more of the parties to the contract.', category: 'Contract Law' },
  { term: 'Severability', definition: 'A provision in a contract which states that if parts of the contract are held to be illegal or otherwise unenforceable, the remainder of the contract should still apply.', category: 'Contract Law' },
  { term: 'Waiver', definition: 'The voluntary relinquishment or surrender of some known right or privilege.', category: 'General' },
];

export function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(glossaryTerms.map(t => t.category)))];

  const filteredTerms = glossaryTerms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || t.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-lg">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legal terms..." 
                className="w-full bg-card border border-border/50 rounded-2xl pl-12 pr-4 py-4 text-[15px] text-foreground focus:ring-1 focus:ring-[#4e8df5] outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
             {categories.map(cat => (
               <button 
                 key={cat} 
                 onClick={() => setActiveCategory(cat)}
                 className={cn(
                   "px-4 py-1.5 text-sm font-medium rounded-full border transition-colors shadow-sm",
                   activeCategory === cat 
                    ? "bg-[#4e8df5] text-white border-[#4e8df5]" 
                    : "border-border/50 bg-card text-muted-foreground hover:text-foreground"
                 )}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Dictionary List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {filteredTerms.map((item, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-[2rem] p-6 hover:border-[#4e8df5]/30 transition-all shadow-sm group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-[#4e8df5] transition-colors">{item.term}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-muted/30 text-muted-foreground border border-border/30">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
            
            {filteredTerms.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-[2rem] border border-border/50">
                No legal terms found matching your search.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
