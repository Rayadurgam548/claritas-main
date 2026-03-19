'use client';

import { Info, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Clause {
  snippet: string;
  highlightColor: 'red' | 'yellow' | 'green';
  tags: string[];
  explanation: string;
  legalReference: string;
  confidenceScore: number;
}

interface DocumentHighlighterProps {
  documentText: string;
  clauses: Clause[];
}

export function DocumentHighlighter({ documentText, clauses }: DocumentHighlighterProps) {
  const [activeHover, setActiveHover] = useState<Clause | null>(null);

  // A very basic highlighter logic: we just list out the extracted highlighted snippets as interactive blocks
  // since perfect regex text replacement across raw PDF content is error-prone.
  
  return (
    <div className="relative h-full flex flex-col md:flex-row gap-6">
      
      {/* Left side: Highlighted Snippets Viewer */}
      <div className="flex-1 bg-card rounded-2xl border border-border p-6 overflow-y-auto h-full space-y-4">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Extracted Clauses</h3>
        {clauses.map((clause, i) => {
          const bgMap = {
            red: 'bg-danger/10 hover:bg-danger/20 border-danger/20',
            yellow: 'bg-warning/10 hover:bg-warning/20 border-warning/20',
            green: 'bg-success/10 hover:bg-success/20 border-success/20'
          };
          const textMap = {
            red: 'text-danger',
            yellow: 'text-warning',
            green: 'text-success'
          };
          
          return (
            <div 
              key={i}
              onMouseEnter={() => setActiveHover(clause)}
              onMouseLeave={() => setActiveHover(null)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${bgMap[clause.highlightColor]}`}
            >
              <p className="text-sm leading-relaxed text-foreground font-medium">"{clause.snippet}"</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {clause.tags.map(t => (
                  <span key={t} className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-background border ${textMap[clause.highlightColor]}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right side: Detail Panel (Sticky) */}
      <div className="w-full md:w-80 shrink-0 h-full">
        {activeHover ? (
          <div className="glass rounded-2xl border border-border/50 p-6 shadow-xl sticky top-0 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm">Clause Analysis</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Why is this important?</p>
                <p className="text-sm">{activeHover.explanation}</p>
              </div>
              
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Legal Reference</p>
                <div className="p-3 bg-muted rounded-lg border border-border flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                  <p className="text-xs font-mono">{activeHover.legalReference}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">AI Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${activeHover.confidenceScore}%` }}></div>
                  </div>
                  <span className="text-xs font-bold">{activeHover.confidenceScore}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-border/50 p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
               <Info className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">Hover over any clause on the left to see the AI's explanation and legal references.</p>
          </div>
        )}
      </div>

    </div>
  );
}
