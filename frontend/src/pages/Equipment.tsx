import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';

export const Equipment: React.FC = () => {
  const fleet = [
    { code: 'EX-101', type: 'Excavator', model: 'Komatsu PC2000', status: 'OPERATIONAL', avail: 92.4, anomaly: 'NORMAL' },
    { code: 'EX-102', type: 'Excavator', model: 'Liebherr R9350', status: 'OPERATIONAL', avail: 88.0, anomaly: 'NORMAL' },
    { code: 'EX-103', type: 'Drill Rig', model: 'Atlas Copco DML', status: 'OPERATIONAL', avail: 95.1, anomaly: 'NORMAL' },
    { code: 'EX-104', type: 'Haulage Truck', model: 'CAT 777G (91t)', status: 'MAINTENANCE', avail: 61.2, anomaly: 'ANOMALY' },
    { code: 'EX-105', type: 'Wheel Loader', model: 'Komatsu WA600', status: 'OPERATIONAL', avail: 89.5, anomaly: 'NORMAL' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-brand-accent" />
          Heavy Mining Machinery Fleet & Isolation Forest Anomaly Monitor
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Unsupervised Isolation Forest algorithm detects subtle equipment telemetry deviations (idle hours, cycle degradation) before mechanical breakdown.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-dark text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-3">Equipment Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Model</th>
                <th className="p-3">Operational Status</th>
                <th className="p-3">7-Day Availability</th>
                <th className="p-3">Telemetry Anomaly State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {fleet.map((item) => (
                <tr key={item.code} className="hover:bg-brand-card/40 transition-colors">
                  <td className="p-3 font-bold text-white tracking-wider">{item.code}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3 text-slate-400">{item.model}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'OPERATIONAL' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-white">{item.avail}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.anomaly === 'ANOMALY'
                        ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      {item.anomaly}
                    </span>
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
