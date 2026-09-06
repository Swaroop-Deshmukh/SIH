import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Database, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const sources = [
  { id: 'sentinel2_l2a', name: 'Sentinel-2 Level-2A Harmonized SR', provider: 'ESA Copernicus', type: 'RASTER', status: 'PENDING_VALIDATION', res: '10/20m' },
  { id: 'sentinel1_grd', name: 'Sentinel-1 C-band SAR GRD', provider: 'ESA Copernicus', type: 'RASTER', status: 'PENDING_VALIDATION', res: '~10m' },
  { id: 'srtm_dem', name: 'SRTM NASA Digital Elevation Model', provider: 'NASA / USGS', type: 'RASTER', status: 'PENDING_VALIDATION', res: '30m' },
  { id: 'geology_gsi', name: 'GSI Geological Quadrangle Maps', provider: 'GSI / NGDR', type: 'VECTOR', status: 'OPTIONAL', res: '1:50k' },
  { id: 'mn_occurrences_public', name: 'Known Manganese Deposits', provider: 'GSI / Published', type: 'VECTOR', status: 'PENDING_VALIDATION', res: 'Point' },
  { id: 'roads_osm', name: 'OpenStreetMap Road Network', provider: 'OSM Contributors', type: 'VECTOR', status: 'AVAILABLE', res: 'Vector' },
  { id: 'moil_production', name: 'MOIL Shift Production History', provider: 'MOIL Limited', type: 'TABULAR', status: 'SYNTHETIC', res: 'Shift' },
  { id: 'moil_equipment', name: 'MOIL Heavy Equipment Fleet', provider: 'MOIL Limited', type: 'TABULAR', status: 'SYNTHETIC', res: 'Telemetry' },
];

export const DataModels: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-brand-accent" />
          Data Registry & Multi-Source Quality Management
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Tracks the integrity, resolution metadata, and licensing status of every spatial and operational dataset. 
          Models gracefully accommodate missing optional data rather than fabricating artificial coverage.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-dark text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-3">Source ID</th>
                <th className="p-3">Dataset Name</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Type</th>
                <th className="p-3">Native Resolution</th>
                <th className="p-3">Registry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-brand-card/40 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-brand-accent">{s.id}</td>
                  <td className="p-3 font-semibold text-white">{s.name}</td>
                  <td className="p-3 text-slate-400">{s.provider}</td>
                  <td className="p-3 text-slate-400">{s.type}</td>
                  <td className="p-3 text-slate-400">{s.res}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
