'use client';

import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { DollarSign, AlertTriangle, Calendar, ShieldCheck, Activity } from 'lucide-react';

interface VisualAnalyticsProps {
  analytics: {
    riskDistribution: { safe: number; moderate: number; risky: number };
    categories: { penalty: number; interest: number; lockIn: number; liability: number };
  };
  simulation: {
    financialLoss: string;
    penalties: string;
    lockIn: string;
    worstCase: string;
  };
  timeline: Array<{ event: string; dateOrTrigger: string }>;
}

const RISK_COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Safe, Moderate, Risky
const CATEGORY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function VisualAnalytics({ analytics, simulation, timeline }: VisualAnalyticsProps) {
  const distributionData = [
    { name: 'Safe', value: analytics.riskDistribution.safe },
    { name: 'Moderate', value: analytics.riskDistribution.moderate },
    { name: 'Risky', value: analytics.riskDistribution.risky },
  ];

  const categoryData = [
    { name: 'Penalty', count: analytics.categories.penalty },
    { name: 'Interest', count: analytics.categories.interest },
    { name: 'Lock-In', count: analytics.categories.lockIn },
    { name: 'Liability', count: analytics.categories.liability },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Distribution Pie Chart */}
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" /> Risk Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success"></div><span className="text-xs">Safe</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-warning"></div><span className="text-xs">Moderate</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-danger"></div><span className="text-xs">Risky</span></div>
          </div>
        </div>

        {/* Risk Category Breakdown */}
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" /> Clause Categories
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Financial Risk Estimation */}
        <div className="glass p-6 rounded-3xl border border-danger/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-danger" /> Financial Impact Simulator
          </h3>
          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Estimated Loss Range</p>
              <p className="text-xl font-bold text-danger">{simulation.financialLoss}</p>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Worst Case Scenario</p>
              <p className="text-sm font-medium">{simulation.worstCase}</p>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" /> Key Timelines & Triggers
          </h3>
          <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar relative before:absolute before:inset-0 before:ml-[9px] before:h-full before:w-0.5 before:bg-border">
            {timeline.length > 0 ? timeline.map((t, i) => (
              <div key={i} className="relative flex items-start gap-4 z-10">
                <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-primary shrink-0 mt-0.5 shadow-glow"></div>
                <div>
                  <p className="text-xs font-bold text-primary">{t.dateOrTrigger}</p>
                  <p className="text-sm text-foreground mt-0.5">{t.event}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground pl-8">No timelines detected.</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
