import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Target, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const DrillPlanning: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-brand-accent" />
          DrillTarget AI — Exploration Prioritization Engine
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl mb-6">
          Aggregates continuous prospectivity pixels into coherent candidate polygons. 
          Ranks targets using a multi-criteria decision model: Prospectivity + Structural Proximity + Geological Support + Accessibility - Uncertainty & Survey Cost.
        </p>

        {/* Drill Targets List */}
        <div className="space-y-4">
          {[
            {
              id: 'MN-042',
              prospectivity: 0.910,
              uncertainty: 0.180,
              area: '1.80 km²',
              rank: '#1 Priority',
              action: 'Ground Geological Survey & Soil Geochemistry',
              status: 'SURVEY_RECOMMENDED',
              support: { geo: 'HIGH', struct: 'HIGH', spectral: 'MEDIUM', access: 'HIGH' }
            },
            {
              id: 'MN-018',
              prospectivity: 0.872,
              uncertainty: 0.220,
              area: '2.16 km²',
              rank: '#2 Priority',
              action: 'Ground Magnetic & Gravity Geophysics',
              status: 'IDENTIFIED',
              support: { geo: 'HIGH', struct: 'MEDIUM', spectral: 'HIGH', access: 'MEDIUM' }
            }
          ].map((t) => (
            <div key={t.id} className="p-4 bg-brand-card/40 border border-brand-border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-base font-bold text-white tracking-wider">{t.id}</span>
                  <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded font-bold border border-brand-accent/30">
                    {t.rank}
                  </span>
                  <span className="text-xs text-slate-400">Footprint: {t.area}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <strong className="text-brand-accent">Recommended Action:</strong> {t.action}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                  <span>Prospectivity: <strong className="text-white">{(t.prospectivity * 100).toFixed(1)}%</strong></span>
                  <span>Uncertainty: <strong className="text-slate-200">{(t.uncertainty * 100).toFixed(1)}%</strong></span>
                  <span>Geology: <strong className="text-emerald-400">{t.support.geo}</strong></span>
                  <span>Structures: <strong className="text-emerald-400">{t.support.struct}</strong></span>
                </div>
              </div>

              <button className="px-4 py-2 bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-accent border border-brand-accent/40 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors flex-shrink-0">
                <span>Target Analysis & SHAP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
