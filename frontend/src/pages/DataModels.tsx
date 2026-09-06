import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_DATA_SOURCES } from '../services/fixtures';
import { Database, CheckCircle, AlertTriangle, Clock, ShieldCheck, FileCheck, Layers, GitBranch } from 'lucide-react';

export const DataModels: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sources' | 'registry' | 'quality'>('sources');

  const sources = FIXTURE_DATA_SOURCES;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Header bar */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-brand-accent" />
            Data Quality Engine & ML Model Governance Registry
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Tracks dataset integrity, native resolution metadata, and licensing status. Models gracefully adapt to missing optional data without fabricating unverified coverage.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-brand-dark p-1 rounded-lg border border-brand-border">
          {[
            { id: 'sources', label: 'Data Sources (16)' },
            { id: 'registry', label: 'ML Model Versions' },
            { id: 'quality', label: 'Data Quality Audits' }
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

      {activeTab === 'sources' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-brand-dark text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="p-3.5">Source Identifier</th>
                  <th className="p-3.5">Dataset Title</th>
                  <th className="p-3.5">Provider / Authority</th>
                  <th className="p-3.5">Spatial Type</th>
                  <th className="p-3.5">Native Resolution</th>
                  <th className="p-3.5">Registry Status</th>
                  <th className="p-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {sources.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-card/40 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-brand-accent">{s.source_id}</td>
                    <td className="p-3.5 font-bold text-white">{s.dataset_name}</td>
                    <td className="p-3.5 text-slate-400">{s.provider}</td>
                    <td className="p-3.5">
                      <span className="px-1.5 py-0.5 rounded bg-brand-dark text-[10px] font-mono text-slate-300">
                        {s.data_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{s.resolution}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                        s.status === 'AVAILABLE'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : s.status === 'SYNTHETIC'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : s.status === 'OPTIONAL'
                          ? 'text-slate-400 bg-slate-500/10 border-slate-500/30'
                          : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-400 max-w-xs truncate">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          {[
            {
              name: 'MnProspectivity-XGBoost',
              version: 'v0.1-prototype',
              module: 'MnExplore AI',
              metrics: 'ROC-AUC: 0.84 | PR-AUC: 0.79 | Precision@25: 68%',
              validation: 'SpatialBlockCV (5km Disjoint Folds)',
              status: 'DEVELOPMENT',
              notes: 'Trained on synthetic prototype labels. Real Sentinel-2 & DEM spatial cubes will be connected in Phase 5-14.'
            },
            {
              name: 'ProductionForecast-RandomForest',
              version: 'v0.1-prototype',
              module: 'ShortfallShield AI',
              metrics: 'MAE: 240 t | RMSE: 310 t | R²: 0.88',
              validation: 'Time-Series Rolling Window (30-day train / 7-day test)',
              status: 'DEVELOPMENT',
              notes: 'Simulation operational data baseline. Evaluates haulage cycle times and equipment downtime factors.'
            },
            {
              name: 'FleetAnomaly-IsolationForest',
              version: 'v0.1-prototype',
              module: 'Equipment Telemetry',
              metrics: 'Contamination: 0.05 | Anomaly Recall: 91%',
              validation: 'Unsupervised Unlabelled Scoring',
              status: 'DEVELOPMENT',
              notes: 'Monitors mechanical telemetry signatures for early failure indication.'
            }
          ].map((m, idx) => (
            <div key={idx} className="p-5 bg-brand-surface border border-brand-border rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-brand-accent" />
                  <span className="font-bold text-sm text-white">{m.name}</span>
                  <span className="text-xs bg-brand-dark px-2 py-0.5 rounded text-brand-accent font-mono">
                    {m.version}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Module: <strong className="text-slate-200">{m.module}</strong></p>
              <div className="p-2.5 bg-brand-dark rounded-lg text-xs font-mono text-emerald-400 mb-2 border border-brand-border/60">
                {m.metrics}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>Validation Strategy: <strong className="text-slate-300">{m.validation}</strong></span>
                <span className="italic">{m.notes}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Continuous Spatial Data Completeness Metric</h3>
          <p className="text-slate-400 leading-relaxed">
            Every candidate drill target computes a composite Data Completeness Score representing the ratio of verified, high-resolution evidence layers present within the polygon footprint.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-brand-card/40 rounded-xl border border-brand-border space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">High Completeness Zone (&gt;70%)</span>
                <span className="text-emerald-400">High Confidence</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Co-registered Sentinel-2 optical bands, Sentinel-1 SAR, 30m SRTM DEM, and mapped GSI structural contacts available.
              </p>
            </div>
            <div className="p-4 bg-brand-card/40 rounded-xl border border-brand-border space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-200">Sparse Completeness Zone (&lt;40%)</span>
                <span className="text-amber-400">Target Investigation Required</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Optical/DEM proxies present but geochemical soil assays and airborne geophysics absent. Model elevates uncertainty estimate.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
