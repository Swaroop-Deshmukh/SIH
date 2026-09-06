import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { useParams, Link } from 'react-router-dom';
import { FIXTURE_TARGETS } from '../services/fixtures';
import { 
  ArrowLeft, 
  Target, 
  ShieldCheck, 
  Compass, 
  BarChart3, 
  Pickaxe, 
  FileText, 
  CheckCircle2, 
  Layers,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const TargetAnalysis: React.FC = () => {
  const { targetId = 'MN-042' } = useParams();

  const target = FIXTURE_TARGETS.find(t => t.target_id === targetId) || FIXTURE_TARGETS[0];

  const shapData = (target.shap_summary || []).map(s => ({
    feature: s.feature,
    contribution: s.contribution,
    color: s.direction === 'positive' ? '#10B981' : '#EF4444'
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Header bar with Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link 
          to="/drill-planning" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drill Targets Portfolio</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Rank: <strong className="text-white">#{target.priority_rank}</strong></span>
          <span className="text-xs bg-brand-accent/20 text-brand-accent px-2.5 py-1 rounded font-bold border border-brand-accent/30">
            {target.target_id} ({target.priority_level})
          </span>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calibrated Prospectivity</p>
          <p className="text-2xl font-black text-white mt-1">{(target.mean_prospectivity * 100).toFixed(1)}%</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Priority: {target.priority_level}</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ensemble Uncertainty</p>
          <p className="text-2xl font-black text-slate-200 mt-1">{target.uncertainty.toFixed(3)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tree Variance Dispersion</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-Source Completeness</p>
          <p className="text-2xl font-black text-brand-accent mt-1">{target.data_completeness}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Optical + DEM + Lineaments</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accessibility Index</p>
          <p className="text-2xl font-black text-white mt-1">{target.accessibility}</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">&lt; 1.5 km to track network</p>
        </div>
      </div>

      {/* Multi-Evidence Support Badges */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Evidence Subsystem Evaluation
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Lithology Support</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{target.geological_support}</span>
            <p className="text-[10px] text-slate-400 mt-1">Sausar Mansar Formation host rock</p>
          </div>
          <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Structural Support</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{target.structural_support}</span>
            <p className="text-[10px] text-slate-400 mt-1">Within 450m of mapped lineament</p>
          </div>
          <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Spectral Proxy</span>
            <span className="font-bold text-amber-400 text-sm mt-0.5 block">{target.spectral_support}</span>
            <p className="text-[10px] text-slate-400 mt-1">Sentinel-2 SWIR & Red-edge signal</p>
          </div>
          <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Terrain Compatibility</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">HIGH</span>
            <p className="text-[10px] text-slate-400 mt-1">Moderate slope & ridge crest</p>
          </div>
        </div>
      </div>

      {/* SHAP Attribution Waterfall Chart */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-accent" />
            SHAP Attribution: Why is {target.target_id} Highly Ranked?
          </h3>
          <span className="text-[10px] text-slate-400 bg-brand-dark px-2 py-0.5 rounded border border-brand-border font-mono">
            Model-Attributed Weight (Not Physical Causality)
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Feature contribution towards manganese prospectivity classification. Positive values (green) drive target priority; penalties (red) account for terrain ruggedness and remoteness.
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={shapData} margin={{ top: 5, right: 30, left: 140, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3B58" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} domain={[-0.15, 0.25]} />
              <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={11} width={180} />
              <Tooltip contentStyle={{ backgroundColor: '#121B2C', borderColor: '#2A3B58', fontSize: '12px' }} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {shapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Next Action Protocol */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Recommended Next Exploration Action
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {target.recommended_action}
        </p>

        {/* 8-Stage Exploration Lifecycle Workflow */}
        <div className="pt-4 border-t border-brand-border/60">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-wider">
            Standard MOIL Field Exploration Verification Chain
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400">
            <span className="px-2 py-1 rounded bg-brand-accent text-brand-dark font-black">1. AI PROSPECT</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">2. GROUND RECCE</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">3. ROCK ASSAY</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">4. GROUND GEOPHYSICS</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">5. DRILLING</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">6. 3D BLOCK MODEL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
