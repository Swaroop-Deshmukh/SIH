import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { TrendingUp, AlertOctagon, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const pipelineStages = [
  { stage: 'Development', capacity: 8500, actual: 6800, status: 'DELAYED' },
  { stage: 'Drilling', capacity: 8000, actual: 7200, status: 'NORMAL' },
  { stage: 'Blasting', capacity: 9000, actual: 8100, status: 'NORMAL' },
  { stage: 'Loading', capacity: 7800, actual: 6900, status: 'NORMAL' },
  { stage: 'Haulage', capacity: 7200, actual: 6600, status: 'BOTTLENECK' },
  { stage: 'Hoisting', capacity: 8000, actual: 6600, status: 'NORMAL' },
  { stage: 'Processing', capacity: 10000, actual: 6600, status: 'NORMAL' },
];

export const Production: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Shortfall Risk Alert */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
            <AlertOctagon className="w-5 h-5" />
            <span>ShortfallShield AI Warning: High Production Deficit Risk (78%)</span>
          </div>
          <p className="text-xs text-slate-300">
            Current 7-day projected output is <strong className="text-white">46,200 t</strong> against target of <strong className="text-white">50,000 t</strong> (projected gap: <strong className="text-red-400">3,800 t</strong>).
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Risk Model</span>
          <p className="text-xs font-semibold text-slate-200">XGBoost Classifier v0.1</p>
        </div>
      </div>

      {/* Bottleneck Pipeline Stage Breakdown */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brand-accent" />
          Production Pipeline Stage Bottleneck Analysis
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Identifies the lowest effective capacity stage limiting total mine output throughput.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineStages.map((s) => (
            <div 
              key={s.stage} 
              className={`p-3 rounded-lg border text-center ${
                s.status === 'BOTTLENECK'
                  ? 'bg-red-500/15 border-red-500/50 text-red-400'
                  : s.status === 'DELAYED'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-brand-card/40 border-brand-border text-slate-300'
              }`}
            >
              <p className="text-xs font-bold mb-1 truncate">{s.stage}</p>
              <p className="text-lg font-extrabold text-white">{s.actual}</p>
              <p className="text-[10px] text-slate-400">Cap: {s.capacity} t/d</p>
              <span className="inline-block mt-2 text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-dark">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
