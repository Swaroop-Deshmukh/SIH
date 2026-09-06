import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_EQUIPMENT } from '../services/fixtures';
import { Settings, AlertTriangle, CheckCircle, Cpu, Filter, Wrench, RefreshCw } from 'lucide-react';

export const Equipment: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [anomalyOnly, setAnomalyOnly] = useState<boolean>(false);

  let fleet = [...FIXTURE_EQUIPMENT];

  if (typeFilter !== 'ALL') {
    fleet = fleet.filter(e => e.equipment_type === typeFilter);
  }

  if (anomalyOnly) {
    fleet = fleet.filter(e => e.anomaly_level === 'ANOMALY');
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Header Summary */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-brand-accent" />
              Heavy Mining Machinery Fleet & Isolation Forest Anomaly Monitor
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl">
              Unsupervised Isolation Forest algorithm evaluates machinery telemetry deviations (idle hours, hydraulic cycle degradation, brake overheating) before catastrophic operational stoppages occur.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              1 Machinery Anomaly Detected
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-4 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Equipment Type:</span>
            {['ALL', 'excavator', 'haulage', 'drill', 'loader'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  typeFilter === t
                    ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                    : 'bg-brand-dark text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAnomalyOnly(!anomalyOnly)}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
              anomalyOnly 
                ? 'bg-red-500 text-white' 
                : 'bg-brand-dark text-slate-400 hover:text-slate-200 border border-brand-border'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Anomalies Only</span>
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-dark text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-3.5">Unit Code</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Equipment Model</th>
                <th className="p-3.5">Nominal Capacity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Availability</th>
                <th className="p-3.5">Telemetry Anomaly State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {fleet.map((item) => (
                <tr key={item.id} className="hover:bg-brand-card/40 transition-colors">
                  <td className="p-3.5 font-bold text-white font-mono tracking-wider">{item.equipment_code}</td>
                  <td className="p-3.5 uppercase text-[11px] text-slate-400 font-semibold">{item.equipment_type}</td>
                  <td className="p-3.5 text-slate-300">{item.model_name}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{item.capacity_value} {item.capacity_unit}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'OPERATIONAL' 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' 
                        : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-white">{item.availability_pct}%</td>
                  <td className="p-3.5">
                    {item.anomaly_level === 'ANOMALY' ? (
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border text-red-400 bg-red-500/10 border-red-500/30 animate-pulse inline-block">
                          ANOMALY (Score: {item.anomaly_score})
                        </span>
                        {item.contributing_factors && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Signals: {item.contributing_factors.join(', ')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                        NORMAL (Score: {item.anomaly_score})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
