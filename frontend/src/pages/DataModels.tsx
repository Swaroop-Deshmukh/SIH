import React from 'react';
import { Database, CheckCircle2, XCircle, AlertTriangle, Layers, Info, ShieldCheck } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';

export const DataModels: React.FC = () => {
  const dataSources = [
    { name: 'Balaghat AOI Boundary', provider: 'GSI / State Boundary', type: 'Vector (GeoJSON)', status: 'AVAILABLE', label: 'REAL DATA', crs: 'EPSG:4326' },
    { name: 'Sentinel-2 L2A Optical SR', provider: 'ESA Copernicus Hub', type: 'Multi-spectral Raster', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:32644' },
    { name: 'Sentinel-1 SAR GRD', provider: 'ESA Copernicus Hub', type: 'C-band SAR Raster', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:32644' },
    { name: 'SRTM 30m NASA DEM', provider: 'NASA / USGS', type: 'Elevation Raster', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:4326' },
    { name: 'GSI Geology Lithology', provider: 'GSI / NGDR', type: 'Vector Shapefile', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:4326' },
    { name: 'GSI Lineaments & Faults', provider: 'GSI / NGDR', type: 'Vector Shapefile', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:4326' },
    { name: 'Known Mn Occurrences', provider: 'GSI / MOIL Catalog', type: 'Point Vector', status: 'UNAVAILABLE', label: 'REAL DATA', crs: 'EPSG:4326' },
    { name: 'Mine Block Spatial Model', provider: 'MOIL Planning', type: 'Spatial Polygons', status: 'SYNTHETIC', label: 'PROTOTYPE SIMULATION DATA', crs: 'EPSG:32644' },
    { name: 'Production History Logs', provider: 'MOIL Operations', type: 'Time-Series Tabular', status: 'SYNTHETIC', label: 'PROTOTYPE SIMULATION DATA', crs: 'N/A' },
    { name: 'Machinery IoT Telemetry', provider: 'Sensor Equipment', type: 'Time-Series Tabular', status: 'SYNTHETIC', label: 'PROTOTYPE SIMULATION DATA', crs: 'N/A' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <Database className="w-4 h-4 text-amber-500" />
            <span>MOIL DATA GOVERNANCE & MODEL REGISTRY</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Geospatial Dataset Availability & ML Model Registry
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic data source registry tracking dataset readiness, feature availability, and ML model versioning.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Data Completeness Score</p>
          <p className="text-xl font-extrabold text-white">11% (Base AOI)</p>
        </div>
      </div>

      {/* Dataset Matrix Table */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Dataset Availability Matrix</span>
          <span className="text-xs font-bold text-[#1E3A8A]">10 Registered Sources</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#0B192C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">CRS</th>
                <th className="py-3 px-4">Category Label</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dataSources.map((ds, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-[#0B192C]">{ds.name}</td>
                  <td className="py-3 px-4 text-slate-600">{ds.provider}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">{ds.type}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{ds.crs}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ds.label === 'REAL DATA' ? 'bg-blue-100 text-[#1E3A8A]' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {ds.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {ds.status === 'AVAILABLE' ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AVAILABLE
                      </span>
                    ) : ds.status === 'SYNTHETIC' ? (
                      <span className="text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> SYNTHETIC
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 font-mono">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" /> UNAVAILABLE
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
