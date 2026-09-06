import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, Compass, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockShap = [
  { feature: 'Favourable Lithology', contribution: 0.18 },
  { feature: 'Lineament Proximity', contribution: 0.14 },
  { feature: 'Seasonal NDVI Deviation', contribution: 0.12 },
  { feature: 'DEM Topographic Index', contribution: 0.08 },
  { feature: 'Sentinel-1 VV/VH Ratio', contribution: 0.05 },
  { feature: 'Geochemical Anomaly (Fe/Mn)', contribution: 0.04 },
  { feature: 'Terrain Ruggedness Index', contribution: -0.06 },
  { feature: 'Remote Road Distance', contribution: -0.09 },
];

export const TargetAnalysis: React.FC = () => {
  const { targetId = 'MN-042' } = useParams();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <Link 
          to="/drill-planning" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drill Targets</span>
        </Link>
        <span className="text-xs bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded font-bold">
          Target ID: {targetId}
        </span>
      </div>

      {/* Target Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Calibrated Prospectivity</p>
          <p className="text-2xl font-bold text-white mt-1">91.0%</p>
          <p className="text-[11px] text-emerald-400 mt-1">Tier: VERY HIGH</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Model Uncertainty</p>
          <p className="text-2xl font-bold text-slate-200 mt-1">0.180</p>
          <p className="text-[11px] text-slate-400 mt-1">Ensemble Variance: Low</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Data Completeness</p>
          <p className="text-2xl font-bold text-brand-accent mt-1">68.0%</p>
          <p className="text-[11px] text-slate-400 mt-1">Optical + DEM + Structure</p>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Accessibility Index</p>
          <p className="text-2xl font-bold text-white mt-1">HIGH</p>
          <p className="text-[11px] text-emerald-400 mt-1">&lt; 1.2 km from road</p>
        </div>
      </div>

      {/* SHAP Explainability Section */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-accent" />
            SHAP Attribution: Why is {targetId} Ranked High?
          </h3>
          <span className="text-[10px] text-slate-400 bg-brand-dark px-2 py-0.5 rounded border border-brand-border">
            Model Attribution (Not Causality)
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Quantifies feature push towards manganese deposit prospectivity. Positive contributions increase score; negative factors (terrain roughness, remoteness) reduce score.
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={mockShap} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3B58" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={11} width={160} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121B2C', borderColor: '#2A3B58', fontSize: '12px' }}
              />
              <Bar dataKey="contribution" fill="#E5A93C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
