import React from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { PrototypeBadge } from './PrototypeBadge';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="h-16 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border px-6 flex items-center justify-between flex-shrink-0 z-10">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <PrototypeBadge type="badge" />

        <div className="h-4 w-[1px] bg-brand-border" />

        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-200">MOIL Lead Engineer</p>
            <p className="text-[10px] text-slate-400">Balaghat Operations</p>
          </div>
        </div>
      </div>
    </header>
  );
};
