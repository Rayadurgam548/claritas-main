'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface RiskRadarProps {
  score: number;
}

export function RiskRadar({ score }: RiskRadarProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = "text-success";
  let bgClass = "bg-success/10 text-success";
  let label = "Safe to Sign";
  let Icon = ShieldCheck;

  if (normalizedScore > 75) {
    colorClass = "text-danger";
    bgClass = "bg-danger/10 text-danger-foreground border-danger/20";
    label = "High Risk";
    Icon = AlertTriangle;
  } else if (normalizedScore > 40) {
    colorClass = "text-warning";
    bgClass = "bg-warning/10 text-warning-foreground border-warning/20";
    label = "Caution";
    Icon = Activity;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-3xl border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6 self-start">Risk Radar</h3>
      
      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className={cn(colorClass, "drop-shadow-sm")}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{normalizedScore}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Score</span>
        </div>
      </div>

      <div className={cn("mt-6 px-4 py-2 rounded-full border border-border shrink-0 flex items-center gap-2", bgClass)}>
        <Icon className="w-4 h-4" />
        <span className="font-medium text-sm">{label}</span>
      </div>
    </div>
  );
}
