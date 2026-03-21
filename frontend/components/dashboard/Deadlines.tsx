'use client';

import { Calendar as CalendarIcon, Clock, AlertTriangle, ChevronLeft, ChevronRight, Plus, MoreVertical, X, Trash, Sparkles, Lightbulb, CheckCircle, ChevronDown } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, isSameDay, isBefore, startOfDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { cn } from '@/app/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const initialDeadlines = [
  { id: 1, title: 'Contract Renewal Deadline', date: addDays(new Date(), 5), priority: 'High', type: 'Renewal' },
  { id: 2, title: 'Lease Payment Due', date: addDays(new Date(), 12), priority: 'Medium', type: 'Payment' },
  { id: 3, title: 'Tax Filing Deadline', date: addDays(new Date(), 26), priority: 'High', type: 'Tax' },
  { id: 4, title: 'Insurance Policy Review', date: addDays(new Date(), 39), priority: 'Low', type: 'Review' },
];

export function Deadlines() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lex_deadlines');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((d: any) => ({ ...d, date: new Date(d.date) }));
        setDeadlines(parsed);
      } catch (e) {
        setDeadlines(initialDeadlines);
      }
    } else {
      setDeadlines(initialDeadlines);
      localStorage.setItem('lex_deadlines', JSON.stringify(initialDeadlines));
    }
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDateStr, setNewDateStr] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: addDays(calendarStart, 34) }); // 5 weeks grid

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:scale-105 transition-all shadow-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Deadline
          </button>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Calendar Area */}
          <div className="lg:col-span-2 space-y-6">
             <div className="glass p-8 rounded-[2rem] border border-border/50 shadow-sm">
               
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold tracking-tight text-foreground">{format(currentDate, 'MMMM yyyy')}</h3>
                 <div className="flex gap-2">
                   <button onClick={() => setCurrentDate(subWeeks(currentDate, 4))} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
                   <button onClick={() => setCurrentDate(addWeeks(currentDate, 4))} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                 </div>
               </div>

               {/* Weekday Headers */}
               <div className="grid grid-cols-7 mb-4">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                   <div key={day} className="text-center text-xs font-semibold text-muted-foreground">{day}</div>
                 ))}
               </div>

               {/* Strict 5x7 Grid matching Reference Image */}
                <div className="grid grid-cols-7 gap-y-6 gap-x-2">
                 {calendarDays.map((day, i) => {
                   const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                   const dateNum = format(day, 'd');
                   const dayDeadlines = deadlines.filter(d => isSameDay(d.date, day));
                   const hasHigh = dayDeadlines.some(d => d.priority === 'High');
                   const hasMedium = dayDeadlines.some(d => d.priority === 'Medium');
                   const hasLow = dayDeadlines.some(d => d.priority === 'Low');
                   const isToday = isSameDay(day, new Date());

                   return (
                     <motion.div 
                       key={i} 
                       className="flex flex-col items-center justify-start min-h-[50px] relative mt-2"
                       onMouseEnter={() => isCurrentMonth && setHoveredDate(day)}
                       onMouseLeave={() => setHoveredDate(null)}
                       onClick={() => isCurrentMonth && setSelectedDate(day)}
                       whileHover={{ scale: 1.1 }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                     >
                        {isCurrentMonth ? (
                          <>
                            <div className={cn(
                              "w-10 h-10 flex flex-col items-center justify-center rounded-2xl text-[15px] font-medium transition-all cursor-pointer relative",
                              dayDeadlines.length > 0 ? "bg-card/80 border shadow-sm" : "text-foreground",
                              dayDeadlines.length > 0 && hasHigh ? "bg-danger/10 border-danger/30 text-danger" : 
                              dayDeadlines.length > 0 && hasMedium ? "bg-warning/10 border-warning/30 text-warning" : 
                              dayDeadlines.length > 0 && hasLow ? "bg-success/10 border-success/30 text-success" : 
                              dayDeadlines.length > 0 ? "border-[#4e8df5]/30 text-[#4e8df5]" : "hover:bg-muted/50",
                              isToday ? "bg-[#4e8df5] text-white shadow-glow" : "",
                              selectedDate && isSameDay(day, selectedDate) ? "ring-2 ring-primary ring-offset-2 ring-offset-background z-20" : "",
                              hoveredDate && isSameDay(day, hoveredDate) ? "shadow-glow-sm" : ""
                            )}>
                              {dateNum}
                            </div>
                            <div className="flex gap-1 mt-1.5 absolute bottom-[-5px]">
                              {hasHigh && <div className="w-1.5 h-1.5 rounded-full bg-danger shadow-glow"></div>}
                              {hasMedium && <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>}
                              {hasLow && <div className="w-1.5 h-1.5 rounded-full bg-success"></div>}
                            </div>
                          </>
                        ) : (
                          <div className="w-10 h-10"></div>
                        )}
                     </motion.div>
                   );
                 })}
               </div>
               
               {/* Legend below calendar */}
               <div className="flex items-center justify-center gap-6 mt-10 pt-6 border-t border-border/50">
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-danger"></div><span className="text-xs text-muted-foreground font-medium">High</span></div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-warning"></div><span className="text-xs text-muted-foreground font-medium">Medium</span></div>
                 <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-success"></div><span className="text-xs text-muted-foreground font-medium">Low</span></div>
               </div>

             </div>
          </div>

          {/* Right Panel - Upcoming Deadlines */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground mb-6">
              <CalendarIcon className="w-5 h-5 text-[#4e8df5]" /> Upcoming Deadlines
            </h3>
            
            <div className="space-y-4">
              {deadlines.map((item) => {
                const diff = differenceInDays(item.date, new Date());
                const leftStr = diff === 0 ? 'Today' : diff < 0 ? `${Math.abs(diff)} days ago` : `${diff} days left`;
                const pColor = item.priority === 'High' ? 'text-danger' : item.priority === 'Medium' ? 'text-warning' : 'text-success';
                const pBg = item.priority === 'High' ? 'bg-danger/5 border-danger/20' : item.priority === 'Medium' ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20';

                return (
                  <div key={item.id} className={cn("p-5 rounded-2xl border transition-colors group relative shadow-sm", pBg)}>
                    
                    <div 
                      className="absolute right-4 top-4 text-muted-foreground hover:text-danger cursor-pointer p-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newD = deadlines.filter(d => d.id !== item.id);
                        setDeadlines(newD);
                        localStorage.setItem('lex_deadlines', JSON.stringify(newD));
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center gap-1.5 mb-2">
                      {item.priority === 'High' && <AlertTriangle className="w-3.5 h-3.5 text-danger" />}
                      {item.priority === 'Medium' && <Clock className="w-3.5 h-3.5 text-warning" />}
                      {item.priority === 'Low' && <Clock className="w-3.5 h-3.5 text-success" />}
                      <span className={cn("text-xs font-semibold", pColor)}>{item.priority}</span>
                    </div>
                    
                    <h4 className="font-bold text-[15px] text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{format(item.date, 'MMM d, yyyy')}</p>
                    
                    <div className={cn("text-xs font-semibold flex items-center gap-1.5", item.priority === 'High' ? 'text-danger' : 'text-warning')}>
                      <Clock className="w-3.5 h-3.5" />
                      {leftStr}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
          
        </div>

        {/* Daily Insights Section */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div 
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 mx-auto max-w-7xl w-full"
            >
              <div className="glass p-8 rounded-[2rem] border border-border/50 shadow-glow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <CalendarIcon className="w-32 h-32" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                   <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-foreground">
                       {format(selectedDate, 'MMMM do, yyyy')}
                     </h3>
                     <p className="text-muted-foreground text-sm flex items-center gap-2">
                       <Clock className="w-4 h-4 text-primary" /> 
                       {deadlines.filter(d => isSameDay(d.date, selectedDate)).length > 0 ? (
                         isBefore(startOfDay(selectedDate), startOfDay(new Date())) ? (
                           <span className="text-danger font-bold uppercase tracking-wider text-[10px] bg-danger/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                             <AlertTriangle className="w-3 h-3" /> {t.overdue_deadlines || "Overdue"}
                           </span>
                         ) : (
                           <span>{deadlines.filter(d => isSameDay(d.date, selectedDate)).length} {t.upcoming_deadlines}</span>
                         )
                       ) : (
                         <span>{t.scheduled_today || "Scheduled for this day"}</span>
                       )}
                     </p>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                     {deadlines.filter(d => isSameDay(d.date, selectedDate)).map((d, idx) => (
                       <div key={idx} className={cn(
                         "px-4 py-3 rounded-2xl border flex flex-col gap-3 min-w-[200px] transition-all hover:border-primary/50",
                         d.priority === 'High' ? "bg-danger/10 border-danger/20 text-danger" : 
                         d.priority === 'Medium' ? "bg-warning/10 border-warning/20 text-warning" : "bg-success/10 border-success/20 text-success"
                       )}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold">
                               <AlertTriangle className="w-4 h-4" /> {d.title}
                            </div>
                            <button 
                              onClick={() => {
                                const newD = deadlines.filter(item => item.id !== d.id);
                                setDeadlines(newD);
                                localStorage.setItem('lex_deadlines', JSON.stringify(newD));
                              }}
                              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="flex gap-2">
                            <button className="text-[10px] uppercase font-bold px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-all">Snooze</button>
                            <button className="text-[10px] uppercase font-bold px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-all">Review Docs</button>
                         </div>
                       </div>
                     ))}
                     {deadlines.filter(d => isSameDay(d.date, selectedDate)).length === 0 && (
                       <div className="px-6 py-4 rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground text-sm italic flex flex-col items-center gap-2">
                         <Sparkles className="w-8 h-8 opacity-20" />
                         No major deadlines scheduled.
                       </div>
                     )}
                   </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Legal Insight</h4>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {isBefore(startOfDay(selectedDate), startOfDay(new Date())) 
                          ? "This date has passed. If there were unresolved obligations, check for 'Cure Period' clauses in your contract to mitigate late penalties."
                          : deadlines.filter(d => isSameDay(d.date, selectedDate)).length > 0 
                            ? "Prioritize documentation for today's tasks. High-priority items require immediate review of termination clauses and indemnity obligations."
                            : "Today is a great day for proactive risk assessment. Review your saved templates or update your entity profiles to ensure compliance readiness."}
                      </p>
                   </div>
                   <div className="p-6 rounded-[1.5rem] bg-card/50 border border-border/50 shadow-sm transition-all hover:bg-card">
                      <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-warning" /> Pro Strategy</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {isBefore(startOfDay(selectedDate), startOfDay(new Date()))
                          ? "Historical data analysis suggests that most litigation risks stem from missed notification windows. Always set reminders 14 days in advance."
                          : "Always verify the 'Effective Date' versus the 'Signing Date' in contracts due this week to avoid accidental breaches of performance timelines."}
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Deadline Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border/50 rounded-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Deadline</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-muted/50 hover:bg-muted rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Title</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    placeholder="e.g. Contract Renewal"
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Date</label>
                  <input 
                    type="date" 
                    value={newDateStr} 
                    onChange={e => setNewDateStr(e.target.value)} 
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-semibold mb-1.5 block">Priority</label>
                  <button 
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary flex items-center justify-between transition-all hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-2 h-2 rounded-full",
                         newPriority === 'High' ? 'bg-danger shadow-glow' : 
                         newPriority === 'Medium' ? 'bg-warning' : 'bg-success'
                       )}></div>
                       <span className="font-medium text-foreground">{newPriority}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showPriorityDropdown ? "rotate-180" : "")} />
                  </button>
                  
                  <AnimatePresence>
                    {showPriorityDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                      >
                        {['High', 'Medium', 'Low'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setNewPriority(p);
                              setShowPriorityDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 border-b border-border/10 last:border-0"
                          >
                             <div className={cn(
                               "w-2.5 h-2.5 rounded-full",
                               p === 'High' ? 'bg-danger shadow-glow-sm' : 
                               p === 'Medium' ? 'bg-warning' : 'bg-success'
                             )}></div>
                             <span className={cn(
                               "text-sm font-semibold",
                               p === 'High' ? 'text-danger' : 
                               p === 'Medium' ? 'text-warning' : 'text-success'
                             )}>{p}</span>
                             {newPriority === p && (
                               <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>
                             )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  onClick={() => {
                    if (!newTitle || !newDateStr) return;
                    const newEntry = { id: Date.now(), title: newTitle, date: new Date(newDateStr), priority: newPriority, type: 'Custom' };
                    const updated = [...deadlines, newEntry];
                    setDeadlines(updated);
                    localStorage.setItem('lex_deadlines', JSON.stringify(updated));
                    setShowAddModal(false);
                    setNewTitle('');
                    setNewDateStr('');
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors mt-2"
                >
                  Save Deadline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
