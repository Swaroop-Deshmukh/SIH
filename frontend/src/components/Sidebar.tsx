import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Target, 
  Building2, 
  TrendingUp, 
  Settings, 
  Brain, 
  MapPin, 
  Database,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Command Center', icon: LayoutDashboard },
    { to: '/exploration', label: 'Exploration GIS', icon: MapIcon },
    { to: '/drill-planning', label: 'Drill Planning', icon: Target },
    { to: '/mine-twin', label: 'MineTwin Blocks', icon: Building2 },
    { to: '/production', label: 'Production Intelligence', icon: TrendingUp },
    { to: '/equipment', label: 'Equipment & Fleet', icon: Settings },
    { to: '/decisions', label: 'Decision Engine', icon: Brain },
    { to: '/field-survey', label: 'Field Survey PWA', icon: MapPin },
    { to: '/data-models', label: 'Data & Models', icon: Database },
  ];

  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-border flex flex-col justify-between flex-shrink-0 z-20">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-brand-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-accent to-amber-200 flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white">MnVision 360</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">MOIL Space-to-Mine</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-accent/15 text-brand-accent font-semibold border-l-2 border-brand-accent'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-brand-border/60 text-[11px] text-slate-500">
        <div className="flex items-center justify-between mb-1">
          <span>System Status</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
        <p className="text-[10px] text-slate-500">v1.0.0-phase1 (Prototype)</p>
      </div>
    </aside>
  );
};
