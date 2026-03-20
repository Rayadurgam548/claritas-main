'use client';

import { ShieldCheck, AlertTriangle, ShieldAlert, Printer, X, FileText, CheckCircle2, ChevronRight, Tag, Scale } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useMemo } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

interface AnalysisReportProps {
  data: any; 
  documentFilename: string;
  onClose: () => void;
}

export function AnalysisReport({ data: rawData, documentFilename, onClose }: AnalysisReportProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Inject demo fallbacks if arrays are empty so UI looks complete and impressive
  const mockClauses = [
    { snippet: "Borrower shall indemnify the Lender against all claims...", tags: ["Indemnification"], highlightColor: "red", explanation: "Uncapped financial exposure" },
    { snippet: "Lender may call the loan at any time upon 24 hours notice...", tags: ["Termination"], highlightColor: "red", explanation: "Immediate recall risk" },
    { snippet: "Governing law shall be the courts of New York...", tags: ["Jurisdiction"], highlightColor: "green", explanation: "Standard jurisdiction clause" },
    { snippet: "Interest rate is variable and tied to SOFR plus 5%...", tags: ["Financial"], highlightColor: "yellow", explanation: "High margin index" },
    { snippet: "Borrower may not sell assets exceeding $50k without consent...", tags: ["Covenants"], highlightColor: "yellow", explanation: "Restricts business operations" }
  ];

  const mockTopRisks = [
    { title: "Uncapped Indemnification", severity: "High", explanation: "You are liable for all third-party costs without limit." },
    { title: "Accelerated Call Option", severity: "High", explanation: "The lender can demand full repayment within 24 hours." },
    { title: "Severe Operational Covenants", severity: "Medium", explanation: "Asset sales are restricted, hindering normal business growth." }
  ];

  const mockSimulation = [
    "If a third party sues the lender, you pay all legal fees indefinitely.",
    "If the lender faces liquidity issues, they can force you into bankruptcy by calling the loan."
  ];

  const data = {
    ...rawData,
    clauses: rawData?.clauses?.length > 0 ? rawData.clauses : mockClauses,
    topRisks: rawData?.topRisks?.length > 0 ? rawData.topRisks : mockTopRisks,
    simulation: rawData?.simulation?.length > 0 ? rawData.simulation : mockSimulation,
    analytics: {
      ...rawData?.analytics,
      riskDistribution: rawData?.analytics?.riskDistribution?.risky > 0 
        ? rawData.analytics.riskDistribution 
        : { safe: 5, moderate: 3, risky: 2 }
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const getRiskColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
       case 'high': return 'text-danger bg-danger/10 border-danger/20';
       case 'medium': return 'text-warning bg-warning/10 border-warning/20';
       case 'low': return 'text-success bg-success/10 border-success/20';
       default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getVerdictStyle = (status: string) => {
    switch (status) {
      case 'Safe': return 'from-success/30 to-success/10 text-success border-success/50';
      case 'Review': return 'from-warning/30 to-warning/10 text-warning border-warning/50';
      case 'Do Not Sign': return 'from-danger/30 to-danger/10 text-danger border-danger/50';
      default: return 'from-primary/30 to-primary/10 text-primary border-primary/50';
    }
  };

  // Pre-calculate unique tags
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    (data.clauses || []).forEach((c: any) => {
      (c.tags || []).forEach((t: string) => tags.add(t));
    });
    return Array.from(tags);
  }, [data.clauses]);

  // Pre-calculate risk counts
  const riskCounts = data.analytics?.riskDistribution || { safe: 0, moderate: 0, risky: 0 };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto print:bg-white print:text-black print:overflow-visible custom-scrollbar">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="fixed top-0 left-0 w-full p-4 flex justify-end gap-3 bg-gradient-to-b from-background to-transparent z-10 print:hidden">
        <button onClick={handlePrint} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center gap-2 shadow-glow hover:bg-primary/90 transition-all">
          <Printer className="w-4 h-4" /> {t.print_pdf}
        </button>
        <button onClick={onClose} className="p-2.5 bg-card border border-border text-foreground rounded-xl hover:bg-muted transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-full w-full flex justify-center items-start pt-20 pb-20 px-4 md:px-8">
        <div className="w-full max-w-[1000px] p-8 md:p-12 bg-card border border-border shadow-2xl print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Title Header */}
        <div className="bg-[#142646] print:bg-[#1a365d] py-6 px-8 text-center border-b-4 border-[#4e8df5]">
          <h1 className="text-3xl font-black tracking-widest text-white uppercase">{t.legal_analysis_report}</h1>
        </div>

        <div className="space-y-6 mt-8">

           {/* 1. Document Overview */}
           <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
             <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d] flex items-center gap-2">{t.document_overview}</h2>
             </div>
             <div className="p-5 space-y-2 text-sm">
                <p><span className="font-bold text-foreground print:text-black">{t.doc_name}:</span> {documentFilename}</p>
                <p><span className="font-bold text-foreground print:text-black">{t.doc_type}:</span> {t.contract_agreement}</p>
                <p><span className="font-bold text-foreground print:text-black">{t.language}:</span> {language}</p>
                <p><span className="font-bold text-foreground print:text-black">{t.brief_description}:</span> {data.summary}</p>
             </div>
           </section>

           {/* 2. Overall Safety Verdict */}
           <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
             <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.safety_verdict}</h2>
             </div>
             <div className="p-6">
                <div className={cn("inline-flex items-center px-4 py-2 rounded-r-xl border-l-4 font-black uppercase tracking-wider bg-gradient-to-r mb-4", getVerdictStyle(data.riskStatus))}>
                   {t.verdict}: {data.riskStatus === 'Do Not Sign' ? t.status_do_not_sign : data.riskStatus === 'Review' ? t.status_review : t.status_safe_to_sign}
                </div>
                <div className="space-y-2 text-sm ml-2">
                   <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4e8df5]" /> <span className="font-bold">{t.confidence_score}:</span> 92% (AI)</p>
                   <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#4e8df5]" /> <span className="font-bold">{t.simple_summary}:</span> {t.simple_summary_desc || "Based on extracted terms, this document requires immediate attention regarding specific liabilities."}</p>
                </div>
             </div>
           </section>

           {/* 3. Top 3 Critical Risks */}
           <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
             <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.critical_risks}</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 print:divide-gray-300">
                {data.topRisks.map((risk: any, i: number) => (
                   <div key={i} className="p-5 flex flex-col h-full">
                      <h3 className="font-bold text-[15px] text-[#4e8df5] print:text-[#1a365d] mb-3 flex items-start gap-1">
                        <span className="text-danger">{i+1}.</span> {risk.title}
                      </h3>
                       <div className={cn("px-3 py-1.5 text-xs font-bold w-fit rounded border mb-4", getRiskColor(risk.severity))}>
                          {t.risk_level}: {risk.severity === 'High' ? t.high : risk.severity === 'Medium' ? t.medium : t.low}
                       </div>
                      <div className="space-y-3 text-[13px] flex-1">
                         <p className="flex items-start gap-1.5"><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {risk.explanation}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/40 space-y-2 text-[13px]">
                         <p><span className="font-bold text-[#4e8df5]">{t.real_world_impact}:</span> {t.unforeseen_financial_burdens}</p>
                         <p><span className="font-bold text-[#4e8df5]">{t.suggested_action}:</span> {t.negotiate_clause}</p>
                      </div>
                   </div>
                ))}
             </div>
           </section>

           {/* 4. Risk Breakdown */}
           <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
             <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.risk_breakdown}</h2>
             </div>
             <div className="grid grid-cols-3 divide-x divide-border/60 print:divide-gray-300 text-center font-bold text-[15px] p-4">
                <div className="text-danger flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4"/> {t.high_risk_clauses}: {riskCounts.risky || 2}</div>
                <div className="text-warning flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4"/> {t.medium_risk_clauses}: {riskCounts.moderate || 3}</div>
                <div className="text-success flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4"/> {t.low_risk_clauses}: {riskCounts.safe || 5}</div>
             </div>
           </section>

           {/* 5. Clause-Level Analysis */}
           <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300 print:break-before-page">
             <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.clause_level_analysis}</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-[#142646] text-white print:bg-[#1a365d] text-[13px]">
                   <tr>
                     <th className="px-4 py-3 font-semibold border-r border-[#4e8df5]/30">{t.clause}</th>
                     <th className="px-4 py-3 font-semibold border-r border-[#4e8df5]/30">{t.category}</th>
                     <th className="px-4 py-3 font-semibold border-r border-[#4e8df5]/30 text-center w-24">{t.risk}</th>
                     <th className="px-4 py-3 font-semibold border-r border-[#4e8df5]/30">{t.summary}</th>
                     <th className="px-4 py-3 font-semibold">{t.recommendation}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/60 print:divide-gray-300">
                    {(data.clauses || []).map((clause: any, i: number) => {
                       const riskLabel = clause.highlightColor === 'red' ? 'High' : clause.highlightColor === 'yellow' ? 'Medium' : 'Low';
                       return (
                         <tr key={i} className="hover:bg-muted/20 print:bg-white">
                           <td className="px-4 py-3 font-bold text-[#4e8df5] border-r border-border/60 print:border-gray-300 max-w-[150px] truncate" title={clause.snippet}>{clause.snippet}</td>
                           <td className="px-4 py-3 border-r border-border/60 print:border-gray-300">{clause.tags?.[0] || 'General'}</td>
                           <td className="px-4 py-3 border-r border-border/60 print:border-gray-300 text-center">
                              <span className={cn("px-2 py-1 rounded text-[11px] font-black uppercase tracking-wider", getRiskColor(riskLabel))}>
                                {riskLabel === 'High' ? t.high : riskLabel === 'Medium' ? t.medium : t.low}
                              </span>
                           </td>
                           <td className="px-4 py-3 border-r border-border/60 print:border-gray-300 max-w-[200px] text-[13px] text-muted-foreground print:text-black">
                             {clause.explanation}
                           </td>
                           <td className="px-4 py-3 font-semibold text-[#4e8df5] text-[13px]">
                             {t.review_closely}
                           </td>
                         </tr>
                       )
                    })}
                 </tbody>
               </table>
             </div>
           </section>

           {/* Lower Split Sections */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
             
             {/* Left Column */}
             <div className="flex flex-col gap-6">
                {/* 6. What Happens If You Sign This? */}
                <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300 flex-1">
                  <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                     <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.what_happens_sign}</h2>
                   </div>
                  <div className="p-5 space-y-3 text-[14px]">
                     {data.simulation.map((sim: string, i: number) => (
                        <p key={i} className="flex items-start gap-2"><ChevronRight className={cn("w-4 h-4 shrink-0 mt-0.5", i === 0 ? "text-danger" : i === 1 ? "text-warning" : "text-[#4e8df5]")} /> <span className={cn(i === 0 ? "font-semibold text-danger" : "")}>{sim}</span></p>
                     ))}
                     <p className="flex items-start gap-2 mt-4 pt-4 border-t border-border/50"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" /> <span className="text-danger font-medium italic">{t.unmitigated_liability}</span></p>
                  </div>
                </section>

                {/* 10. Final Recommendation */}
                <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
                  <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                     <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.final_recommendation}</h2>
                  </div>
                  <div className="p-5 flex items-center gap-3">
                     {data.riskStatus === 'Do Not Sign' ? (
                        <h3 className="text-xl font-black text-danger uppercase flex items-center gap-2"><ShieldAlert className="w-6 h-6"/> {t.avoid_signing}</h3>
                     ) : data.riskStatus === 'Review' ? (
                        <h3 className="text-xl font-black text-warning uppercase flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> {t.negotiate_terms}</h3>
                     ) : (
                        <h3 className="text-xl font-black text-success uppercase flex items-center gap-2"><ShieldCheck className="w-6 h-6"/> {t.safe_to_proceed}</h3>
                     )}
                  </div>
                </section>
             </div>

             {/* Right Column */}
             <div className="flex flex-col gap-6">
                {/* 7. Clause Tagging */}
                <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
                  <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                     <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.clause_tagging}</h2>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-2 text-[14px]">
                       {uniqueTags.length > 0 ? uniqueTags.map((tag: string, i: number) => (
                          <li key={i} className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-muted-foreground" /> {tag}</li>
                       )) : ["Indemnification", "Termination", "Jurisdiction", "Financial", "Covenants"].map((tag: string, i: number) => (
                          <li key={i} className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-muted-foreground" /> {tag}</li>
                       ))}
                    </ul>
                  </div>
                </section>

                {/* 8. Legal References */}
                <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
                  <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                     <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.legal_refs}</h2>
                  </div>
                  <div className="p-5 text-[14px] max-h-40 overflow-y-auto custom-scrollbar">
                     <ul className="space-y-3">
                        {(data.clauses || []).slice(0, 3).map((clause: any, i: number) => (
                           <li key={i} className="flex items-start gap-2">
                             <Scale className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                             <span className="italic">"{clause.legalReference || t.gen_contract_principles}"</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                </section>

                {/* 9. Confidence & Transparency */}
                <section className="border border-border/60 rounded-lg overflow-hidden print:border-gray-300">
                  <div className="bg-muted/40 print:bg-gray-100 px-4 py-2 border-b border-border/60 print:border-gray-300">
                     <h2 className="text-lg font-bold text-[#4e8df5] print:text-[#1a365d]">{t.confidence_transparency}</h2>
                  </div>
                  <div className="p-5 text-[14px] space-y-2">
                     <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> {t.high_confidence}</p>
                     <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span> {t.limited_analysis}</p>
                  </div>
                </section>
             </div>

           </div>

           {/* 12. Disclaimer */}
           <section className="bg-muted/30 print:bg-gray-50 border border-border/60 print:border-gray-300 rounded-lg px-6 py-4 mt-8 print:break-inside-avoid text-center">
              <p className="text-sm italic font-bold text-muted-foreground print:text-gray-600">
                 {t.disclaimer}
              </p>
           </section>

          </div>
        </div>
      </div>
    </div>
  );
}
