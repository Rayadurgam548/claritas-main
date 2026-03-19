'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/app/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatSidebar } from '@/components/layout/ChatSidebar';
import { LexDropZone } from '@/components/dashboard/LexDropZone';
import { RiskRadar } from '@/components/dashboard/RiskRadar';
import { LocalizationControls } from '@/components/dashboard/LocalizationControls';
import { DashboardOverview } from '@/components/dashboard/Overview';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { Deadlines } from '@/components/dashboard/Deadlines';
import { Glossary } from '@/components/dashboard/Glossary';
import { ExpertPanel } from '@/components/dashboard/ExpertPanel';
import { VisualAnalytics } from '@/components/dashboard/VisualAnalytics';
import { DocumentHighlighter } from '@/components/dashboard/DocumentHighlighter';
import { AnalysisReport } from '@/components/dashboard/AnalysisReport';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { LegalAPI, UploadResponse, AnalysisResponse, ComparisonResponse, DocumentData } from '@/app/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, AlertTriangle, Scale, Loader2, ArrowLeft, AlertCircle, RotateCcw, ShieldCheck, ShieldAlert, Upload, Search, Filter, Grid, List, Clock } from 'lucide-react';
import { cn } from '@/app/lib/utils';

type ViewState = 'upload' | 'analyzing' | 'single' | 'comparing';

const dummyDocuments = [
  { id: 'dummy-1', filename: 'Employment Contract 2026.pdf', status: 'analyzed', category: 'Contracts', privacyMode: false, createdAt: new Date().toISOString() },
  { id: 'dummy-2', filename: 'Commercial Lease Agreement.docx', status: 'analyzed', category: 'Real Estate', privacyMode: false, createdAt: new Date().toISOString() },
  { id: 'dummy-3', filename: 'Tax Assessment 2025.pdf', status: 'processing', category: 'Tax', privacyMode: false, createdAt: new Date().toISOString() },
  { id: 'dummy-4', filename: 'Merger NDA.pdf', status: 'analyzed', category: 'Business', privacyMode: false, createdAt: new Date().toISOString() },
  { id: 'dummy-5', filename: 'Court Summons.pdf', status: 'analyzed', category: 'Legal', privacyMode: false, createdAt: new Date().toISOString() },
  { id: 'dummy-6', filename: 'Liability Insurance Policy.pdf', status: 'analyzed', category: 'Insurance', privacyMode: false, createdAt: new Date().toISOString() },
];

export default function Home() {
  const router = useRouter();

  const [currentNavTab, setCurrentNavTab] = useState<string>('dashboard');
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [activeTab, setActiveTab] = useState<'analysis' | 'original'>('analysis');
  const [activeDocument, setActiveDocument] = useState<UploadResponse | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Weakened type for advanced schema flexibility
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  
  // For Comparison
  const [secondDoc, setSecondDoc] = useState<UploadResponse | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResponse | null>(null);

  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
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
    if (currentNavTab === 'documents') {
       fetchDocs();
    }
  }, [currentNavTab, viewState]);

  const handleUploadSuccess = async (responses: UploadResponse[]) => {
    if (responses.length === 0) return;

    if (responses.length === 1) {
      // Single view flow
      const doc = responses[0];
      setActiveDocument(doc);
      setViewState('analyzing');
      setCurrentNavTab('documents');
      
      try {
        const analysis = await LegalAPI.analyzeDocument(doc.id);
        setAnalysisResult(analysis);
        setViewState('single');
      } catch (error: any) {
        console.error("Analysis failed", error);
        setAnalysisError(error.message || "An unexpected error occurred during AI analysis.");
      }
    } else if (responses.length === 2) {
      // Comparison flow
      const doc1 = responses[0];
      const doc2 = responses[1];
      setActiveDocument(doc1);
      setSecondDoc(doc2);
      setViewState('analyzing');
      setCurrentNavTab('documents');
      
      try {
        const compare = await LegalAPI.compareDocuments(doc1.id, doc2.id);
        setComparisonResult(compare);
        setViewState('comparing');
      } catch (error: any) {
        console.error("Comparison failed", error);
        setAnalysisError(error.message || "An unexpected error occurred during document comparison.");
      }
    }
  };

  const resetView = () => {
    setActiveDocument(null);
    setAnalysisResult(null);
    setSecondDoc(null);
    setComparisonResult(null);
    setAnalysisError(null);
    setViewState('upload');
    setActiveTab('analysis');
  };

  const handleViewDocument = async (doc: DocumentData) => {
    const docData: UploadResponse = {
      id: doc.id,
      filename: doc.filename,
      status: doc.status,
      privacyMode: doc.privacyMode,
    };
    setActiveDocument(docData);
    setViewState('analyzing');
    
    try {
      const analysis = await LegalAPI.analyzeDocument(doc.id);
      setAnalysisResult(analysis);
      setViewState('single');
    } catch (error: any) {
      console.error("View failed", error);
      setAnalysisError(error.message || "Failed to retrieve document analysis.");
    }
  };

  const handleReanalyze = async () => {
    if (!activeDocument) return;
    setAnalysisError(null);
    setViewState('analyzing');
    setActiveTab('analysis');
    try {
      const analysis = await LegalAPI.analyzeDocument(activeDocument.id);
      setAnalysisResult(analysis);
      setViewState('single');
    } catch (error: any) {
      console.error("Analysis failed", error);
      setAnalysisError(error.message || "An unexpected error occurred during AI analysis.");
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (activeDocument?.id === docId || secondDoc?.id === docId) {
      resetView();
    }
  };

  const renderContent = () => {
    switch (currentNavTab) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setCurrentNavTab} onUploadSuccess={handleUploadSuccess} />;
      case 'documents':
        const allDocs = [...documents, ...dummyDocuments as any];
        const filteredDocs = selectedCategory === 'All' ? allDocs : allDocs.filter(d => d.category === selectedCategory || (d.category === undefined && selectedCategory === 'Legal'));
        
        return (
          <div className="flex-1 flex flex-col h-full relative">
            {/* Top Navbar */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                {viewState !== 'upload' && (
                  <button 
                    onClick={resetView}
                    className="mr-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-xl font-semibold tracking-tight">
                  {viewState === 'upload' ? 'Documents' : 
                   viewState === 'analyzing' ? 'Analyzing...' :
                   viewState === 'single' ? activeDocument?.filename :
                   'Document Comparison'}
                </h2>
              </div>
              
              {(viewState === 'single' || viewState === 'comparing') && (
                <LocalizationControls />
              )}
            </header>

            <div className="flex-1 overflow-y-auto p-8 relative">
            <AnimatePresence mode="wait">
              {viewState === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8 pb-10 max-w-7xl mx-auto w-full"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-white">Documents</h1>
                      <p className="text-muted-foreground mt-1">Manage and organize your legal documents</p>
                    </div>
                    <button className="px-5 py-2.5 bg-[#4e8df5] text-white text-sm font-semibold rounded-lg hover:bg-[#4e8df5]/90 transition-all shadow-sm flex items-center gap-2">
                       <Upload className="w-4 h-4" /> Upload Document
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search documents..." 
                        className="w-full bg-[#10141d] border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-[#4e8df5] outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-lg bg-[#10141d] text-sm font-medium hover:bg-muted/50 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                      </button>
                      <button onClick={() => setViewMode('grid')} className={`p-2 border border-border/50 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'bg-[#10141d] text-muted-foreground hover:bg-muted/50'}`}>
                        <Grid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-2 border border-border/50 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-muted text-foreground' : 'bg-[#10141d] text-muted-foreground hover:bg-muted/50'}`}>
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                     <button onClick={() => setSelectedCategory('All')} className={`px-3 py-1 text-xs font-semibold rounded-full border border-border/50 transition-colors ${selectedCategory === 'All' ? 'bg-[#4e8df5] text-white' : 'bg-[#10141d] text-muted-foreground hover:text-foreground'}`}>All</button>
                     {['Contracts', 'Real Estate', 'Tax', 'Business', 'Legal', 'Insurance'].map(tag => (
                       <button onClick={() => setSelectedCategory(tag)} key={tag} className={`px-3 py-1 text-xs font-medium rounded-full border border-border/50 transition-colors ${selectedCategory === tag ? 'bg-[#4e8df5] text-white' : 'bg-[#10141d] text-muted-foreground hover:text-foreground'}`}>{tag}</button>
                     ))}
                  </div>

                  {/* Upload Drop Zone (matching Image 2 somewhat, but combined) */}
                  <div className="mb-6">
                    <LexDropZone onUploadSuccess={handleUploadSuccess} />
                  </div>

                  {/* Document Grid / List */}
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
                      <div key={doc.id} onClick={() => doc.id.startsWith('dummy') ? null : handleViewDocument(doc)} className={`bg-[#10141d] border border-border/50 rounded-2xl p-5 hover:border-[#4e8df5]/50 transition-colors cursor-pointer flex ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col justify-between h-[200px]'}`}>
                        <div className={viewMode === 'list' ? "flex items-center gap-4 w-1/2" : ""}>
                          <div className={`rounded-xl bg-[#142646] flex items-center justify-center shrink-0 ${viewMode === 'list' ? 'w-12 h-12' : 'w-10 h-10 mb-4'}`}>
                            <FileText className="w-5 h-5 text-[#4e8df5]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[15px] truncate text-white mb-1" title={doc.filename}>{doc.filename}</h4>
                            <p className="text-xs text-muted-foreground uppercase">{doc.filename.split('.').pop()} • Document</p>
                          </div>
                        </div>
                        
                        <div className={viewMode === 'list' ? "flex items-center gap-8 w-1/2 justify-end" : ""}>
                          <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'mb-4' : ''}`}>
                            <div className="flex items-center gap-1.5">
                              {doc.status === 'analyzed' ? <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" /> : doc.status === 'processing' ? <Clock className="w-3.5 h-3.5 text-warning" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />}
                              <span className={cn("text-xs font-semibold capitalize", doc.status === 'analyzed' ? 'text-[#22c55e]' : doc.status === 'processing' ? 'text-warning' : 'text-[#22c55e]')}>
                                {doc.status || 'Analyzed'}
                              </span>
                            </div>
                            <span className={`text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis ${viewMode === 'grid' ? 'ml-2' : 'hidden lg:inline'}`}>
                               {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                             <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-muted-foreground border border-border/50 rounded-full bg-background">{doc.category || 'Legal'}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
                         <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                         <h3 className="text-lg font-semibold text-foreground mb-1">No documents yet</h3>
                         <p className="text-muted-foreground text-sm">Upload your first legal document to get started.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {viewState === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-6xl mx-auto space-y-6 pb-20 mt-8 w-full"
                >
                  {analysisError ? (
                    <div className="bg-danger/10 border border-danger/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-20 shadow-sm">
                      <AlertCircle className="w-16 h-16 text-danger mb-4" />
                      <h3 className="text-xl font-semibold text-danger mb-2">Analysis Failed</h3>
                      <p className="text-danger-foreground mb-8 text-sm leading-relaxed">{analysisError}</p>
                      <button onClick={resetView} className="px-6 py-2 bg-card rounded-lg border border-border hover:bg-muted font-medium transition-colors text-foreground">
                        Go Back to Upload
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center space-y-4 mb-12 mt-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                          <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center relative shadow-xl border border-border">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-semibold">Step 2: AI Analysis & Risk Scoring</h3>
                          <p className="text-muted-foreground text-sm max-w-sm">
                            Extracting entities, rating legal risk, and mapping protections...
                          </p>
                        </div>
                      </div>

                      {/* Skeleton Loaders for Demo Quality Polish */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse opacity-60">
                        <div className="md:col-span-1 h-[400px] bg-card rounded-3xl border border-border shadow-sm flex flex-col justify-center items-center p-6 bg-gradient-to-br from-card to-muted/20">
                           <div className="w-48 h-48 rounded-full border-4 border-dashed border-border/50 animate-pulse delay-75"></div>
                        </div>
                        <div className="md:col-span-2 bg-card rounded-3xl border border-border shadow-sm p-6 space-y-4 bg-gradient-to-tr from-card to-muted/20">
                          <div className="w-1/3 h-6 bg-muted rounded-md mb-8"></div>
                          <div className="w-full h-20 bg-muted/60 rounded-xl delay-75"></div>
                          <div className="w-full h-20 bg-muted/60 rounded-xl delay-150"></div>
                          <div className="w-full h-20 bg-muted/60 rounded-xl delay-300"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse opacity-60">
                        <div className="h-[250px] bg-card rounded-3xl border border-border shadow-sm p-6 space-y-4">
                           <div className="w-1/2 h-6 bg-muted rounded-md mb-6"></div>
                           <div className="w-full h-12 bg-danger/10 rounded-lg"></div>
                           <div className="w-full h-12 bg-danger/10 rounded-lg"></div>
                        </div>
                        <div className="h-[250px] bg-card rounded-3xl border border-border shadow-sm p-6 space-y-4">
                           <div className="w-1/2 h-6 bg-muted rounded-md mb-6"></div>
                           <div className="w-5/6 h-4 bg-muted/80 rounded-sm"></div>
                           <div className="w-4/6 h-4 bg-muted/80 rounded-sm"></div>
                           <div className="w-full h-4 bg-muted/80 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {viewState === 'single' && analysisResult && (
                <motion.div
                  key="single"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-7xl mx-auto space-y-6 pb-20 flex flex-col h-full"
                >
                  {/* Top Header & Verdict */}
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card p-6 rounded-3xl border border-border shadow-sm mb-2">
                    <div className="flex items-center gap-4">
                      {analysisResult.riskStatus === 'Safe' ? (
                        <div className="w-14 h-14 rounded-2xl bg-success/20 text-success flex items-center justify-center shrink-0 shadow-glow"><ShieldCheck className="w-7 h-7" /></div>
                      ) : analysisResult.riskStatus === 'Do Not Sign' ? (
                        <div className="w-14 h-14 rounded-2xl bg-danger/20 text-danger flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.5)]"><ShieldAlert className="w-7 h-7" /></div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-warning/20 text-warning flex items-center justify-center shrink-0 shadow-glow"><AlertTriangle className="w-7 h-7" /></div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Status: {analysisResult.riskStatus || 'Analysis Complete'}</h2>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleReanalyze} className="p-3 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground transition-colors"><RotateCcw className="w-5 h-5" /></button>
                      <button onClick={() => setShowReport(true)} className="px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:scale-105 transition-all shadow-glow">Generate Final Report</button>
                    </div>
                  </div>

                  {/* Top 3 Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {analysisResult.topRisks?.map((risk: any, i: number) => (
                      <div key={i} className="glass p-5 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-3">
                           <h3 className="font-bold text-[15px] max-w-[70%] truncate">{risk.title}</h3>
                           <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg border", 
                             risk.severity === 'High' ? "bg-danger/10 text-danger border-danger/20" :
                             risk.severity === 'Medium' ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20"
                           )}>{risk.severity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* View Tabs */}
                  <div className="flex bg-muted/30 p-1 rounded-xl w-fit border border-border/50 items-center gap-2 mb-4">
                    <button onClick={() => setActiveTab('analysis')} className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'analysis' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Highlighted Clauses</button>
                    <button onClick={() => setActiveTab('original')} className={cn("px-6 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'original' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Original File</button>
                  </div>

                  {/* Document Content View */}
                  <div className="flex-1 min-h-[500px] mb-8">
                     {activeTab === 'analysis' ? (
                       <DocumentHighlighter documentText={activeDocument?.filename || ''} clauses={analysisResult.clauses || []} />
                     ) : (
                       <div className="flex-1 bg-card rounded-3xl border border-border shadow-sm h-[600px] flex overflow-hidden">
                         <iframe src={`/api/documents/${activeDocument?.id}/file`} className="w-full h-full border-none bg-white font-serif" title="Viewer"/>
                       </div>
                     )}
                  </div>

                  {/* Visual Analytics */}
                  {(analysisResult.analytics || analysisResult.simulation) && (
                    <div className="pt-8 border-t border-border/50">
                      <h3 className="text-xl font-bold mb-6">Deep Visual Analytics</h3>
                      <VisualAnalytics analytics={analysisResult.analytics} simulation={analysisResult.simulation} timeline={analysisResult.timeline || []} />
                    </div>
                  )}
                  
                  {showReport && <AnalysisReport data={analysisResult} documentFilename={activeDocument?.filename || 'Unknown Document'} onClose={() => setShowReport(false)} />}
                </motion.div>
              )}

              {viewState === 'comparing' && comparisonResult && (
                <motion.div
                  key="comparing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-7xl mx-auto space-y-6 pb-20"
                >
                  <div className="bg-card p-6 rounded-3xl border border-border shadow-sm mb-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                      <Scale className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Comparison Verdict</h3>
                      <p className="text-muted-foreground text-sm">{comparisonResult.proClientVerdict}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Document 1 Context */}
                    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {activeDocument?.filename}
                      </h3>
                      <div className="space-y-4">
                        {(Array.isArray(comparisonResult?.differences) ? comparisonResult.differences : []).map((diff, idx) => (
                          <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{diff.section}</h4>
                            <p className="text-sm text-foreground">{diff.doc1Text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document 2 Context */}
                    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        {secondDoc?.filename}
                      </h3>
                      <div className="space-y-4">
                        {(Array.isArray(comparisonResult?.differences) ? comparisonResult.differences : []).map((diff, idx) => (
                          <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{diff.section}</h4>
                            <p className="text-sm text-foreground">{diff.doc2Text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Conflicts Warning */}
                  {Array.isArray(comparisonResult?.conflicts) && comparisonResult.conflicts.length > 0 && (
                    <div className="mt-6 bg-warning/10 border border-warning/20 p-6 rounded-3xl">
                      <h3 className="text-warning-foreground font-semibold flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        Critical Conflicts Detected
                      </h3>
                      <div className="space-y-3">
                        {comparisonResult.conflicts.map((conflict, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row gap-4 justify-between bg-card/80 p-4 rounded-xl shadow-sm text-sm">
                            <div className="flex-1">
                              <span className="font-medium text-foreground block mb-1">Conflict Description</span>
                              <span className="text-muted-foreground">{conflict.description}</span>
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-foreground block mb-1">Potential Impact</span>
                              <span className="text-danger-foreground">{conflict.impact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        );
      case 'ai':
        return <AIAssistant documentId={activeDocument?.id} />;
      case 'deadlines':
        return <Deadlines />;
      case 'expertPanel':
        return <ExpertPanel activeDocumentId={activeDocument?.id} />;
      case 'glossary':
        return <Glossary />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="lex-theme">
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
        <Sidebar activeTab={currentNavTab} onTabChange={setCurrentNavTab} />
        
        <main className="flex-1 flex flex-col min-w-0 bg-muted/10 relative">
          {renderContent()}
        </main>
        
        {currentNavTab === 'documents' && <ChatSidebar documentId={activeDocument?.id} />}
      </div>
    </ThemeProvider>
  );
}
