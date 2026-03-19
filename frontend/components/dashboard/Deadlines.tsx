'use client';

import { Calendar as CalendarIcon, Clock, AlertTriangle, ChevronLeft, ChevronRight, Plus, MoreVertical } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';

const mockDeadlines = [
  { id: 1, title: 'Contract Renewal Deadline', date: addDays(new Date(), 5), priority: 'High', type: 'Renewal', time: 'Jan 25, 2026', left: '5 days left', pColor: 'text-danger' },
  { id: 2, title: 'Lease Payment Due', date: addDays(new Date(), 12), priority: 'Medium', type: 'Payment', time: 'Feb 1, 2026', left: '12 days left', pColor: 'text-warning' },
  { id: 3, title: 'Tax Filing Deadline', date: addDays(new Date(), 26), priority: 'High', type: 'Tax', time: 'Feb 15, 2026', left: '26 days left', pColor: 'text-danger' },
  { id: 4, title: 'Insurance Policy Review', date: addDays(new Date(), 39), priority: 'Low', type: 'Review', time: 'Feb 28, 2026', left: '39 days left', pColor: 'text-success' },
];

export function Deadlines() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Hardcoded to match Jan 2026 screenshot mock

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: addDays(calendarStart, 34) }); // 5 weeks grid

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      <div className="px-8 py-6 border-b border-border/50 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Deadlines & Calendar</h2>
          <p className="text-sm text-muted-foreground">Track important dates and never miss a deadline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#4e8df5] text-white text-sm font-semibold rounded-lg hover:bg-[#4e8df5]/90 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Deadline
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
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
                   const isSelected = dateNum === '20' && isCurrentMonth; // mock selection
                   const isToday = dateNum === '25' && isCurrentMonth; // mock today

                   return (
                     <div key={i} className="flex flex-col items-center justify-center">
                        {isCurrentMonth ? (
                          <div className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-2xl text-[15px] font-medium transition-all cursor-pointer hover:bg-muted/50",
                            isSelected ? "bg-[#10141d]/80 border border-[#4e8df5] text-[#4e8df5] shadow-sm" : "text-foreground",
                            isToday ? "border-b-2 border-danger rounded-b-none" : ""
                          )}>
                            {dateNum}
                          </div>
                        ) : (
                          <div className="w-12 h-12"></div>
                        )}
                     </div>
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
              {mockDeadlines.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#10141d] border border-border/50 hover:border-border transition-colors group relative shadow-sm">
                  
                  <div className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-2">
                    {item.priority === 'High' && <AlertTriangle className="w-3.5 h-3.5 text-danger" />}
                    {item.priority === 'Medium' && <Clock className="w-3.5 h-3.5 text-warning" />}
                    {item.priority === 'Low' && <Clock className="w-3.5 h-3.5 text-success" />}
                    <span className={cn("text-xs font-semibold", item.pColor)}>{item.priority}</span>
                  </div>
                  
                  <h4 className="font-bold text-[15px] text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{item.time}</p>
                  
                  <div className={cn("text-xs font-semibold flex items-center gap-1.5", item.priority === 'High' ? 'text-danger' : 'text-warning')}>
                    <Clock className="w-3.5 h-3.5" />
                    {item.left}
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
