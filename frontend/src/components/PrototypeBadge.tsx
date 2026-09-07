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
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold">⚠ {message}</span>
        </div>
        <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded uppercase font-bold">
          SIH Demonstration Sandbox
        </span>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
        <span>⚠</span> {message}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
      Prototype Data
    </span>
  );
};
