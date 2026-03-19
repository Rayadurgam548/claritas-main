'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { ArrowRight, MoreHorizontal, Sparkles, AlertTriangle, Calendar as CalendarIcon, Lightbulb, FileText, Search, Activity, ShieldAlert } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { LexDropZone } from './LexDropZone';
import { useState, useEffect } from 'react';
import { getUser } from '@/app/lib/auth';
import { format, differenceInDays } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const activityData = [
  { name: 'Mon', queries: 8, documents: 2 },
  { name: 'Tue', queries: 19, documents: 5 },
  { name: 'Wed', queries: 15, documents: 3 },
  { name: 'Thu', queries: 21, documents: 6 },
  { name: 'Fri', queries: 12, documents: 4 },
  { name: 'Sat', queries: 6, documents: 1 },
  { name: 'Sun', queries: 5, documents: 0 },
];

const monthlyActivityData = [
  { name: 'Week 1', queries: 45, documents: 14 },
  { name: 'Week 2', queries: 62, documents: 18 },
  { name: 'Week 3', queries: 38, documents: 9 },
  { name: 'Week 4', queries: 86, documents: 20 },
];

const categoryData = [
  { name: 'Contracts', value: 35 },
  { name: 'Real Estate', value: 28 },
  { name: 'Employment', value: 19 },
  { name: 'NDA', value: 14 },
  { name: 'Other', value: 7 },
];

export function DashboardOverview({ onNavigate, onUploadSuccess, documents = [] }: { onNavigate?: (tab: string) => void, onUploadSuccess?: (res: any[]) => void, documents?: any[] }) {
  const [user, setUser] = useState<any>(null);
  const [activityView, setActivityView] = useState<'week' | 'month'>('week');
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [aiQueriesCount, setAiQueriesCount] = useState(128); // Can be static or also localstorage
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setUser(getUser());
    
    // Check localStorage for deadlines
    const storedDeadlines = localStorage.getItem('lex_deadlines');
    if (storedDeadlines) {
      try {
        const parsed = JSON.parse(storedDeadlines).map((d: any) => ({ ...d, date: new Date(d.date) }));
        setDeadlinesCount(parsed.length);
        
        // Sort ascending and take top 3 active
        const sorted = parsed
          .filter((d: any) => d.date.getTime() >= Date.now() - 86400000)
          .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
          .slice(0, 3);
        setUpcomingDeadlines(sorted);
      } catch (e) {
        setDeadlinesCount(0);
        setUpcomingDeadlines([]);
      }
    } else {
      // Default initial fallback if not visited yet
      setDeadlinesCount(4);
      setUpcomingDeadlines([
        { id: 1, title: 'Contract Renewal', date: new Date(Date.now() + 5*86400000), priority: 'High' },
        { id: 2, title: 'Lease Payment', date: new Date(Date.now() + 12*86400000), priority: 'Medium' },
        { id: 3, title: 'Tax Filing Deadline', date: new Date(Date.now() + 26*86400000), priority: 'Low' }
      ]);
    }
  }, []);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-y-auto">
      <div className="max-w-[1400px] w-full mx-auto p-4 md:p-8 space-y-8">

        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-muted-foreground">Here's what's happening with your legal matters today.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => onNavigate && onNavigate('ai')} className="px-5 py-2.5 bg-card border border-border/50 text-foreground text-sm font-semibold rounded-lg hover:bg-muted/50 transition-all shadow-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4e8df5]" /> Ask AI
             </button>
             <button onClick={() => {
                const dropzone = document.querySelector('.lex-drop-zone') as HTMLElement;
                if (dropzone) dropzone.scrollIntoView({ behavior: 'smooth' });
             }} className="px-5 py-2.5 bg-[#4e8df5] text-white text-sm font-semibold rounded-lg hover:bg-[#4e8df5]/90 transition-all shadow-sm">
                Upload Document
             </button>
          </div>
        </div>

        {/* Hero Upload Zone */}
        <div className="lex-drop-zone bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm">
           <LexDropZone onUploadSuccess={onUploadSuccess || (() => {})} />
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col cursor-pointer hover:border-[#4e8df5]/50 transition-colors" onClick={() => onNavigate?.('documents')}>
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                 <FileText className="w-5 h-5" /> <span className="text-sm font-semibold">{t.total_docs}</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{documents.length}</div>
              <div className="text-xs text-[#22c55e] font-semibold flex items-center gap-1">+ {documents.length > 0 ? '1' : '0'} this week</div>
           </div>
           
           <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col cursor-pointer hover:border-[#f59e0b]/50 transition-colors" onClick={() => onNavigate?.('deadlines')}>
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                 <CalendarIcon className="w-5 h-5" /> <span className="text-sm font-semibold">{t.upcoming_deadlines}</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{deadlinesCount}</div>
              <div className="text-xs text-warning font-semibold flex items-center gap-1">Tracked custom dates</div>
           </div>
           
           <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col cursor-pointer hover:border-[#4e8df5]/50 transition-colors" onClick={() => onNavigate?.('ai')}>
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                 <Activity className="w-5 h-5" /> <span className="text-sm font-semibold">{t.ai_queries}</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{aiQueriesCount}</div>
              <div className="text-xs text-primary font-semibold flex items-center gap-1">12 responses today</div>
           </div>
           
           <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col cursor-pointer hover:border-danger/50 transition-colors" onClick={() => onNavigate?.('documents')}>
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                 <ShieldAlert className="w-5 h-5" /> <span className="text-sm font-semibold">Risk Alerts</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">4</div>
              <div className="text-xs text-danger font-semibold flex items-center gap-1">1 high, 3 medium</div>
           </div>
        </div>
        
        {/* Top Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Weekly Activity Area Chart */}
          <div className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold tracking-tight text-foreground">{activityView === 'week' ? 'Weekly' : 'Monthly'} Activity</h3>
              <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
                <button 
                  onClick={() => setActivityView('week')}
                  className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${activityView === 'week' ? 'bg-[#27272a] text-white' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setActivityView('month')}
                  className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${activityView === 'month' ? 'bg-[#27272a] text-white' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Month
                </button>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityView === 'week' ? activityData : monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4e8df5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4e8df5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={5} domain={[0, 24]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#10141d', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="queries" stroke="#4e8df5" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" />
                  <Area type="monotone" dataKey="documents" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorDocs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#4e8df5]"></div><span className="text-xs text-muted-foreground font-medium">AI Queries</span></div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div><span className="text-xs text-muted-foreground font-medium">Documents</span></div>
            </div>
          </div>

          {/* Document Categories Bar Chart */}
          <div className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Document Categories</h3>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="h-[280px] w-[95%]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={5} domain={[0, 36]} />
                  <YAxis dataKey="name" type="category" width={85} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-5} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#10141d', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28} fill="#4e8df5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* Bottom Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Deadlines */}
          <div className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t.upcoming_deadlines}</h3>
              <button onClick={() => onNavigate?.('deadlines')} className="text-sm font-semibold text-[#4e8df5] flex items-center gap-1 hover:underline">{t.view_all} <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
               {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((dl) => {
                 const diff = differenceInDays(dl.date, new Date());
                 const isHigh = dl.priority === 'High';
                 const isMed = dl.priority === 'Medium';
                 
                 return (
                   <div key={dl.id} className={cn("p-4 rounded-2xl border flex gap-4 items-start", 
                     isHigh ? "bg-danger/10 border-danger/20" : isMed ? "bg-warning/10 border-warning/20" : "bg-success/10 border-success/20")}>
                     {isHigh ? (
                       <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                     ) : (
                       <CalendarIcon className={cn("w-5 h-5 shrink-0 mt-0.5", isMed ? "text-warning" : "text-success")} />
                     )}
                     <div className="flex-1 min-w-0">
                       <h4 className="font-semibold text-foreground mb-1 text-sm truncate">{dl.title}</h4>
                       <p className="text-xs text-muted-foreground">{format(dl.date, 'MMM d, yyyy')}</p>
                     </div>
                     <div className={cn("w-8 h-8 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs", 
                        isHigh ? "border-danger/30 text-danger bg-danger/10" : isMed ? "border-warning/30 text-warning bg-warning/10" : "border-success/30 text-success bg-success/10")}>
                        {diff < 0 ? 'Due' : `${diff}d`}
                     </div>
                   </div>
                 );
               }) : (
                 <div className="p-6 text-center text-muted-foreground">No upcoming deadlines logged.</div>
               )}
            </div>
          </div>

          {/* Recent AI Queries */}
          <div className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t.ai_queries}</h3>
              <button onClick={() => onNavigate?.('ai')} className="text-sm font-semibold text-[#4e8df5] flex items-center gap-1 hover:underline">{t.new_chat} <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex gap-4 items-start">
                 <Sparkles className="w-5 h-5 text-[#4e8df5] shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-semibold text-foreground mb-1 text-sm leading-tight text-foreground/90">What are the key clauses in my employment contract?</h4>
                   <p className="text-xs text-muted-foreground">10 min ago</p>
                 </div>
               </div>
               
               <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex gap-4 items-start">
                 <Sparkles className="w-5 h-5 text-[#4e8df5] shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-semibold text-foreground mb-1 text-sm leading-tight text-foreground/90">Explain the termination clause in my lease agreement</h4>
                   <p className="text-xs text-muted-foreground">2 hours ago</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-card rounded-[2rem] p-6 border border-border/50 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-6 relative z-10">
               <h3 className="text-lg font-bold">Quick Tips</h3>
               <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
             </div>
             
             <div className="space-y-5 relative z-10">
               <div className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-[#27272a] text-[#f59e0b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#f59e0b]/30">1</div>
                 <div>
                   <h4 className="font-semibold text-sm text-foreground mb-1">Upload contracts for instant analysis</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">Our AI identifies key clauses and risks automatically</p>
                 </div>
               </div>
               
               <div className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-[#27272a] text-[#f59e0b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#f59e0b]/30">2</div>
                 <div>
                   <h4 className="font-semibold text-sm text-foreground mb-1">Set deadline reminders</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">Never miss important dates with smart notifications</p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
