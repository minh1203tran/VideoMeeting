import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { StatMetric } from '../../../types';
import { cn } from '../../../utils/cn';

interface StatCardProps {
  metric: StatMetric;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ metric, colorClass }) => (
  <div className={cn(
    "relative overflow-hidden rounded-[2.5rem] p-6 flex flex-col justify-between h-44 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 group",
    colorClass,
    // Add inner shadow for depth and glass feel
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_30px_-10px_rgba(0,0,0,0.1)]",
    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(0,0,0,0.4)]"
  )}>
    {/* Background Decorative Blob */}
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>

    <div className="relative z-10 flex justify-between items-start">
      <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-sm border border-white/10">
        <metric.icon className="w-6 h-6 text-white" />
      </div>
      <div className={cn(
        "flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10",
        metric.trend === 'up' ? "bg-emerald-400/20 text-white" : 
        metric.trend === 'down' ? "bg-white/20 text-white" : "bg-white/10 text-white"
      )}>
        {metric.trend === 'up' && <ArrowUp className="w-3 h-3" />}
        {metric.trend === 'down' && <ArrowDown className="w-3 h-3" />}
        {metric.trend === 'neutral' && <Minus className="w-3 h-3" />}
        <span>{metric.trendValue}</span>
      </div>
    </div>
    
    <div className="relative z-10 mt-4">
      <p className="text-white/80 text-sm font-semibold tracking-wide uppercase opacity-90">{metric.label}</p>
      <div className="flex items-baseline gap-1">
         <p className="text-4xl font-extrabold text-white mt-1 tracking-tight drop-shadow-sm">{metric.value}</p>
      </div>
    </div>
  </div>
);
