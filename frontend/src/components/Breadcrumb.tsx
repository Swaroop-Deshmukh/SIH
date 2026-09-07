import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const routeMap: Record<string, string> = {
  '/': 'Home',
  '/exploration': 'Exploration GIS',
  '/drill-planning': 'Drill Target AI',
  '/mine-twin': 'MineTwin Block Model',
  '/production': 'Production Forecasting',
  '/equipment': 'Machinery Telemetry & Fleet',
  '/decisions': 'Decision Support Engine',
  '/field-survey': 'Field Operations Survey',
  '/data-models': 'Data Availability & Models',
  '/contact': 'MOIL Contact & Office Info'
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const currentTitle = routeMap[path] || 'Page';

  if (path === '/') return null; // No breadcrumb needed on Home page

  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 md:px-8 py-2 text-xs text-slate-600 flex items-center justify-between">
      <div className="flex items-center gap-1.5 font-medium">
        <NavLink to="/" className="text-[#1E3A8A] hover:underline flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </NavLink>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">{currentTitle}</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
        <span>Balaghat AOI (EPSG:4326)</span>
      </div>
    </div>
  );
};
