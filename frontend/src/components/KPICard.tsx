import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'ok' | 'warning' | 'danger';
  isPrototype?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'ok',
  isPrototype = false,
  icon,
  subtitle,
}) => {
  const statusColor = {
    ok: 'border-brand-border hover:border-brand-primary/50',
    warning: 'border-amber-500/40 bg-amber-500/[0.03]',
    danger: 'border-red-500/40 bg-red-500/[0.03]',
  }[status];

  return (
    <div className={`bg-brand-surface rounded-xl border p-4 transition-all duration-200 shadow-sm relative overflow-hidden ${statusColor}`}>
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <span className="truncate">{title}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs mt-2">
        {subtitle && <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>}
        {trendValue && (
          <span className={`text-[11px] font-medium flex items-center gap-0.5 ${
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {trend === 'up' && '▲'}
            {trend === 'down' && '▼'}
            {trendValue}
          </span>
        )}
      </div>

      {isPrototype && (
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-end">
          <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-semibold">
            Simulation Data
          </span>
        </div>
      )}
    </div>
  );
};
