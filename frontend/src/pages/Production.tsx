import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { 
  FIXTURE_PRODUCTION_SUMMARY, 
  FIXTURE_FORECAST, 
  FIXTURE_PIPELINE_STAGES, 
  FIXTURE_SHORTFALL 
} from '../services/fixtures';
import { TrendingUp, AlertOctagon, BarChart2, Layers, ShieldAlert, Sliders } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const Production: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'shortfall' | 'bottlenecks'>('forecast');
  const [horizonDays, setHorizonDays] = useState<number>(7);

  const shortfall = FIXTURE_SHORTFALL;
  const summary = FIXTURE_PRODUCTION_SUMMARY;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Production Module Sub-Navigation */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            ShortfallShield AI — Production & Bottleneck Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational early warning integrating mine readiness, fleet telemetry anomalies, and haulage cycle efficiency.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-brand-dark p-1 rounded-lg border border-brand-border">
          {[
            { id: 'forecast', label: 'Production Forecast' },
            { id: 'shortfall', label: 'Shortfall Early Warning' },
            { id: 'bottlenecks', label: 'Bottleneck Engine' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'forecast' && (
        <div className="space-y-6">
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Monthly Target</span>
              <p className="text-2xl font-black text-white mt-1">{summary.target_tonnes.toLocaleString()} t</p>
              <p className="text-[11px] text-slate-400 mt-1">5 MOIL Operating Leases</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Model Predicted Output</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{summary.actual_tonnes.toLocaleString()} t</p>
              <p className="text-[11px] text-red-400 mt-1">Projected gap: {summary.gap_tonnes.toLocaleString()} t</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Achievement</span>
              <p className="text-2xl font-black text-white mt-1">{summary.achievement_pct}%</p>
              <p className="text-[11px] text-amber-400 mt-1">Deficit threshold breached</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Shortfall Probability</span>
              <p className="text-2xl font-black text-red-400 mt-1">{shortfall.risk_score * 100}%</p>
              <p className="text-[11px] text-red-400 font-semibold mt-1">Status: HIGH RISK</p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-accent" />
                  7-Day Forward Daily Output Forecast vs Target Meterage
                </h3>
                <p className="text-xs text-slate-400">RandomForest / XGBoost Regressor ensemble predictions with confidence bounds</p>
              </div>
              <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded font-bold">
                High Shortfall Probability
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FIXTURE_FORECAST} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3B58" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[5500, 7500]} />
                  <Tooltip contentStyle={{ backgroundColor: '#121B2C', borderColor: '#2A3B58', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="target" name="Daily Target (t)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="forecast" name="Forecast Prediction (t)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shortfall' && (
        <div className="space-y-6">
          {/* Prominent Risk Banner */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex items-start gap-4">
            <AlertOctagon className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-1">
                Shortfall Alert: 7-Day Production Deficit Projected at North Balaghat (BLG-01)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The ShortfallShield model evaluates a <strong className="text-white">78% likelihood</strong> of missing the upcoming weekly target by approximately <strong className="text-red-400">3,800 tonnes</strong>.
              </p>
            </div>
          </div>

          {/* Root-Cause SHAP Breakdown */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-accent" />
              Model-Attributed Root-Cause Signals (SHAP Contributions)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Model signals identified as primary contributors toward the projected deficit. (Denotes machine learning model attribution, not unconditional mechanical causality.)
            </p>

            <div className="space-y-3">
              {Object.entries(shortfall.shap_values || {}).map(([cause, val]) => (
                <div key={cause} className="p-3 bg-brand-card/40 border border-brand-border rounded-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{cause}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-brand-dark rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${val * 100 * 3}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-red-400">+{(val * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bottlenecks' && (
        <div className="space-y-6">
          {/* Bottleneck Stage Grid */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-accent" />
              Mining Process Stage Utilization & Bottleneck Detection
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Evaluation of effective daily throughput identifying the limiting operational constraint.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {FIXTURE_PIPELINE_STAGES.map((s) => (
                <div 
                  key={s.stage} 
                  className={`p-3 rounded-lg border text-center ${
                    s.status === 'BOTTLENECK'
                      ? 'bg-red-500/15 border-red-500/50 text-red-400'
                      : s.status === 'DELAYED'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-brand-card/40 border-brand-border text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold mb-1 truncate">{s.stage}</p>
                  <p className="text-lg font-extrabold text-white">{s.actual_tpd.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Cap: {s.capacity_tpd.toLocaleString()} t/d</p>
                  <p className="text-[11px] font-semibold text-slate-300 mt-1">{s.utilization_pct}% util</p>
                  <span className={`inline-block mt-2 text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    s.status === 'BOTTLENECK' ? 'bg-red-500/30 text-red-300' : 'bg-brand-dark text-slate-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
