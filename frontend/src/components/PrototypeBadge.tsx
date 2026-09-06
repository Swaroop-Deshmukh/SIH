import React from 'react';

interface PrototypeBadgeProps {
  type?: 'banner' | 'badge' | 'inline';
  message?: string;
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({
  type = 'badge',
  message = 'PROTOTYPE SIMULATION DATA — Not real MOIL operational data'
}) => {
  if (type === 'banner') {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-300 font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>⚠ {message}</span>
        </div>
        <span className="text-[10px] text-amber-400/70 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">
          SIH Demonstration Sandbox
        </span>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
        <span>⚠</span> {message}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
      Prototype
    </span>
  );
};
