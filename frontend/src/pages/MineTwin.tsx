import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Building2, CheckCircle2, Clock, AlertCircle, HardHat } from 'lucide-react';

export const MineTwin: React.FC = () => {
  const [selectedMine, setSelectedMine] = useState('BLG-01');

  const blocks = [
    { code: 'A-12', tonnes: '42,000 t', grade: '31.2%', readiness: 94, status: 'READY', dev: 95, drill: 100, blast: 'READY', equip: true },
    { code: 'A-13', tonnes: '38,000 t', grade: '29.8%', readiness: 78, status: 'DEVELOPMENT', dev: 80, drill: 90, blast: 'IN_PROGRESS', equip: true },
    { code: 'A-14', tonnes: '55,000 t', grade: '33.1%', readiness: 42, status: 'DEVELOPMENT', dev: 60, drill: 0, blast: 'NOT_READY', equip: false },
    { code: 'B-17', tonnes: '67,000 t', grade: '28.4%', readiness: 25, status: 'BLOCKED', dev: 45, drill: 30, blast: 'NOT_READY', equip: false },
    { code: 'B-18', tonnes: '72,000 t', grade: '30.5%', readiness: 91, status: 'READY', dev: 100, drill: 100, blast: 'READY', equip: true },
    { code: 'B-20', tonnes: '91,000 t', grade: '32.7%', readiness: 96, status: 'PRODUCING', dev: 100, drill: 100, blast: 'READY', equip: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Distinction Header */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-accent" />
            MineTwin AI — Operational Ore Readiness Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enforcing the MOIL core distinction: <span className="text-slate-300 font-semibold">Reserve ≠ Mineable Ore ≠ Operationally Ready Ore</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-brand-dark px-3 py-1.5 rounded-lg border border-brand-border">
          <span className="text-xs text-slate-400">Selected Mine:</span>
          <select 
            value={selectedMine} 
            onChange={(e) => setSelectedMine(e.target.value)}
            className="bg-transparent text-xs font-semibold text-brand-accent focus:outline-none cursor-pointer"
          >
            <option value="BLG-01">North Balaghat (BLG-01)</option>
            <option value="BLG-02">Central Balaghat (BLG-02)</option>
            <option value="BLG-03">South Balaghat (BLG-03)</option>
          </select>
        </div>
      </div>

      {/* Mine Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((b) => (
          <div key={b.code} className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:border-brand-accent/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-base text-white tracking-wider">Block {b.code}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                b.status === 'READY' || b.status === 'PRODUCING'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : b.status === 'DEVELOPMENT'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {b.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Ore:</span>
                <span className="text-white font-semibold">{b.tonnes}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Mn Grade:</span>
                <span className="text-brand-accent font-semibold">{b.grade}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Operational Readiness Score:</span>
                <span className={`font-bold ${b.readiness >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {b.readiness}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-brand-dark rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full ${b.readiness >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${b.readiness}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-brand-border/60">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className={`w-3.5 h-3.5 ${b.dev >= 90 ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>Dev: {b.dev}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className={`w-3.5 h-3.5 ${b.drill >= 90 ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>Drilling: {b.drill}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className={`w-3.5 h-3.5 ${b.blast === 'READY' ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>Blasting: {b.blast}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <HardHat className={`w-3.5 h-3.5 ${b.equip ? 'text-emerald-400' : 'text-red-400'}`} />
                <span>Equip: {b.equip ? 'Ready' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
