import React from 'react';
import { Settings, ShieldCheck, AlertCircle, ChevronRight, Activity, Wrench } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_EQUIPMENT } from '../services/fixtures';

export const Equipment: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — Heavy Machinery Telemetry & Isolation Forest Anomaly Detection" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <Settings className="w-4 h-4 text-amber-500" />
            <span>MOIL HEAVY MACHINERY FLEET TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Machinery Anomaly Detection & Predictive Maintenance
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Isolation Forest anomaly detection on dump trucks, hydraulic shovels, drill rigs, and crushers.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Fleet Availability</p>
          <p className="text-xl font-extrabold text-white">94.2% Operational</p>
        </div>
      </div>

      {/* Fleet Telemetry Grid */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Active Equipment Telemetry & Maintenance Queue</span>
          <span className="text-xs font-normal text-slate-500">Isolation Forest Model v1.0</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIXTURE_EQUIPMENT.map((eq) => (
            <div key={eq.id} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 hover:border-[#1E3A8A] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0B192C]">{eq.equipment_code}</h4>
                  <p className="text-[11px] text-slate-500 font-bold uppercase">{eq.equipment_type} ({eq.model_name})</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  eq.anomaly_level === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {eq.anomaly_level}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200 font-mono">
                <div>Status: <strong>{eq.status}</strong></div>
                <div>Availability: <strong>{eq.availability_pct}%</strong></div>
                <div>Anomaly Score: <strong>{eq.anomaly_score.toFixed(2)}</strong></div>
                <div>Capacity: <strong>{eq.capacity_value} {eq.capacity_unit}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Manufacturer: <strong className="text-slate-800">{eq.manufacturer || 'MOIL Fleet'}</strong></span>
                <span className="text-[#1E3A8A] font-semibold hover:underline cursor-pointer">Dispatch Ticket →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
