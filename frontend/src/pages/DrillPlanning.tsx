import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_TARGETS } from '../services/fixtures';
import { Target, ArrowRight, ShieldCheck, Activity, Sliders, DollarSign, Compass, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DrillPlanning: React.FC = () => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'rank' | 'prospectivity' | 'cost' | 'area'>('rank');

  let targets = [...FIXTURE_TARGETS];

  if (priorityFilter !== 'ALL') {
    targets = targets.filter(t => t.priority_level === priorityFilter);
  }

  if (sortBy === 'prospectivity') {
    targets.sort((a, b) => b.mean_prospectivity - a.mean_prospectivity);
  } else if (sortBy === 'cost') {
    targets.sort((a, b) => (a.estimated_survey_cost_inr || 0) - (b.estimated_survey_cost_inr || 0));
  } else if (sortBy === 'area') {
    targets.sort((a, b) => b.area_sqkm - a.area_sqkm);
  } else {
    targets.sort((a, b) => a.priority_rank - b.priority_rank);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Header card with ranking explanation */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-brand-accent" />
          DrillTarget AI — Exploration Prioritization Engine
        </h2>
        <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
          Aggregates continuous prospectivity pixels into coherent candidate polygons. 
          Ranks targets using a multi-criteria decision model: <span className="text-slate-200 font-semibold">Prospectivity + Structural Proximity + Geological Support + Accessibility - Uncertainty & Survey Cost</span>.
        </p>

        {/* Filter and Sorting Controls */}
        <div className="mt-6 pt-4 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter Priority:</span>
            {['ALL', 'VERY_HIGH', 'HIGH', 'MEDIUM'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  priorityFilter === p
                    ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                    : 'bg-brand-dark text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-brand-dark border border-brand-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="rank">Recommended Priority Rank</option>
              <option value="prospectivity">Highest Prospectivity Score</option>
              <option value="cost">Lowest Estimated Survey Cost</option>
              <option value="area">Polygon Footprint Area</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drill Target Cards */}
      <div className="space-y-4">
        {targets.map((t) => (
          <div key={t.id} className="p-5 bg-brand-surface border border-brand-border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand-accent/50 transition-all">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-black text-white tracking-wider">{t.target_id}</span>
                <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded font-bold border border-brand-accent/30 uppercase tracking-wider">
                  Rank #{t.priority_rank} ({t.priority_level})
                </span>
                <span className="text-xs text-slate-400">Footprint: <strong className="text-slate-200">{t.area_sqkm} km²</strong></span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  Est. Survey Cost: <strong className="text-brand-accent">₹{((t.estimated_survey_cost_inr || 0) / 100000).toFixed(1)} Lakhs</strong>
                </span>
              </div>

              <p className="text-xs text-slate-300">
                <strong className="text-brand-accent">Next Operational Step:</strong> {t.recommended_action}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Prospectivity: <strong className="text-white font-bold">{(t.mean_prospectivity * 100).toFixed(1)}%</strong></span>
                <span>Uncertainty: <strong className="text-slate-200">{(t.uncertainty * 100).toFixed(1)}%</strong></span>
                <span>Geology Support: <strong className="text-emerald-400 font-semibold">{t.geological_support}</strong></span>
                <span>Structural Lineaments: <strong className="text-emerald-400 font-semibold">{t.structural_support}</strong></span>
                <span>Road Accessibility: <strong className="text-emerald-400 font-semibold">{t.accessibility}</strong></span>
              </div>
            </div>

            <Link
              to={`/exploration/${t.target_id}`}
              className="px-4 py-2 bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-accent border border-brand-accent/40 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors flex-shrink-0"
            >
              <span>Target Analysis & SHAP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
