'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { ArrowRight, MoreHorizontal, Sparkles, AlertTriangle, Calendar as CalendarIcon, Lightbulb, FileText, Search, Activity, ShieldAlert, TrendingUp, Clock, Plus, Scale } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { LexDropZone } from './LexDropZone';
import { useState, useEffect } from 'react';
import { getUser } from '@/app/lib/auth';
import { format, differenceInDays } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { UploadResponse } from '@/app/lib/api';
import { RobotAvatar } from './RobotAvatar';

const COLORS = ['#4e8df5', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

export function DashboardOverview({ onNavigate, onUploadSuccess, documents = [] }: { onNavigate?: (tab: string) => void, onUploadSuccess: (res: UploadResponse[]) => void, documents?: any[] }) {
  const [user, setUser] = useState<any>(null);
  const [avatarId, setAvatarId] = useState(1);
  const [activityView, setActivityView] = useState<'week' | 'month'>('week');
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [aiQueriesCount, setAiQueriesCount] = useState(0); 
  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setUser(getUser());
    const savedAvatar = localStorage.getItem('lex_avatar_id');
    if (savedAvatar) {
      setAvatarId(parseInt(savedAvatar));
    }
    
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
      // Default initial fallback
      setDeadlinesCount(4);
      setUpcomingDeadlines([
        { id: 1, title: t.mock_deadline_1, date: new Date(Date.now() + 5*86400000), priority: 'High' },
        { id: 2, title: t.mock_deadline_2, date: new Date(Date.now() + 12*86400000), priority: 'Medium' },
        { id: 3, title: t.mock_deadline_3, date: new Date(Date.now() + 26*86400000), priority: 'Low' }
      ]);
    }
    
    // Check localStorage for AI Queries
    const storedQueries = localStorage.getItem('lex_queries');
    if (storedQueries) {
      try {
        const parsed = JSON.parse(storedQueries);
        setAiQueriesCount(parsed.length);
        setRecentQueries(parsed.slice(-2).reverse());
      } catch (e) {
        setAiQueriesCount(0);
      }
    }
  }, [t]);

  // Compute Categories from documents
  const categoryChartData = documents.reduce((acc: any[], doc) => {
    const cat = doc.category || 'Other';
    const existing = acc.find(item => item.name === cat);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: cat, value: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Simple activity calculation based on actual data
  const dynamicActivityData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
    // Current day index (0-6)
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    
    // Find how many days ago this "day" was in the current week
    // Day of week starts at Sunday (0).
    const daysAgo = (currentDayOfWeek - index + 7) % 7;
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - daysAgo);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    // Count documents created on this day
    const docCount = documents.filter(doc => {
      const created = new Date(doc.createdAt);
      return created >= targetDate && created < nextDay;
    }).length;

    // Count queries from localStorage (if they have timestamps)
    let queryCount = 0;
    const isBrowser = typeof window !== 'undefined';
    const stored = isBrowser ? localStorage.getItem('lex_queries') : null;
    if (stored) {
      try {
        const queries = JSON.parse(stored);
        queryCount = queries.filter((q: any) => {
          // If it has a timestamp, use it normally
          if (q.timestamp) {
            const qTime = new Date(q.timestamp);
            return qTime >= targetDate && qTime < nextDay;
          }
          // Fallback: If no timestamp but it's "Today" in the chart, include it
          // This ensures existing queries (from before the fix) show up on the "Today" bar
          if (day === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDayOfWeek]) {
            return true;
          }
          return false;
        }).length;
      } catch (e) {}
    }

    return { 
      name: day,
      isToday: day === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDayOfWeek],
      queries: queryCount,
      documents: docCount
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl space-y-2 min-w-[150px]">
          <p className="text-sm font-bold text-foreground flex items-center justify-between gap-4">
            {label} 
            {data.isToday && (
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/10">
                Today
              </span>
            )}
          </p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">{entry.name}:</span>
                </div>
                <span className="text-sm font-bold text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <RobotAvatar id={avatarId} className="w-16 h-16 shadow-lg border-2 border-primary/20" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t.welcome_message}, {user?.name || 'Counsel'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {t.dashboard_subtitle || 'Here is what is happening with your legal operations today.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate?.('documents')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 font-semibold shadow-glow hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> {t.upload_document}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">{t.total_docs}</p>
          <h3 className="text-3xl font-bold mt-1">{documents.length}</h3>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:border-warning/20 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-warning/10 text-warning rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-full">
              <Activity className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">{t.ai_queries}</p>
          <h3 className="text-3xl font-bold mt-1">{aiQueriesCount}</h3>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:border-danger/20 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-danger/10 text-danger rounded-2xl group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-danger bg-danger/10 px-2 py-1 rounded-full">
              <ShieldAlert className="w-3 h-3" /> {deadlinesCount > 2 ? 'Action' : 'Normal'}
            </span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">{t.deadlines}</p>
          <h3 className="text-3xl font-bold mt-1">{deadlinesCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Upload & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-3xl p-8 overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1 space-y-4">
                 <h2 className="text-2xl font-bold">{t.quick_analyze}</h2>
                 <p className="text-muted-foreground text-sm">
                   {t.upload_desc}
                 </p>
                 <div className="flex flex-wrap gap-2 pt-2">
                   <div className="bg-background/50 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"><ShieldAlert className="w-3 h-3 text-danger" /> {t.risk_guard}</div>
                   <div className="bg-background/50 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-warning" /> {t.ai_summary}</div>
                   <div className="bg-background/50 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"><Scale className="w-3 h-3 text-primary" /> {t.case_law}</div>
                 </div>
               </div>
               <div className="w-full md:w-80 shrink-0">
                 <LexDropZone onUploadSuccess={onUploadSuccess} />
               </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold">{t.analysis_activity || 'System Activity'}</h3>
               <div className="flex bg-muted p-1 rounded-lg">
                 <button 
                  onClick={() => setActivityView('week')}
                  className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all", activityView === 'week' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                 >
                   {t.week}
                 </button>
                 <button 
                  onClick={() => setActivityView('month')}
                  className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all", activityView === 'month' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                 >
                   {t.month}
                 </button>
               </div>
             </div>
             
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dynamicActivityData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                   <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }} content={<CustomTooltip />} />
                   <Bar dataKey="queries" name={t.ai_queries_label || 'Queries'} fill="#4e8df5" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="documents" name={t.documents_label || 'Docs'} fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Right Col: Categories & Deadlines */}
        <div className="space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">{t.category_distribution}</h3>
            {categoryChartData.length > 0 ? (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                   {categoryChartData.map((item, i) => (
                     <div key={i} className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                       <span className="text-xs font-semibold truncate">{item.name} ({item.value})</span>
                     </div>
                   ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                <Search className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-medium">{t.no_docs_yet}</p>
              </div>
            )}
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t.upcoming_deadlines || 'Deadlines'}</h3>
              <button onClick={() => onNavigate?.('deadlines')} className="text-primary hover:text-primary/80"><ArrowRight className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border", 
                      deadline.priority === 'High' ? "bg-danger/10 text-danger border-danger/20" :
                      deadline.priority === 'Medium' ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20"
                    )}>
                      {deadline.priority}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {format(deadline.date, 'MMM dd')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{deadline.title}</h4>
                </div>
              )) : (
                <div className="py-8 text-center text-muted-foreground text-sm italic">
                  {t.no_deadlines}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm bg-gradient-to-tr from-[#27272a] to-[#18181b] text-white">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
              <h3 className="text-lg font-bold">Pro Legal Tips</h3>
            </div>
            
            <div className="space-y-5">
               <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/10 text-[#f59e0b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#f59e0b]/30">1</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.tip_1_title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{t.tip_1_desc}</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/10 text-[#f59e0b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#f59e0b]/30">2</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.tip_2_title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{t.tip_2_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
