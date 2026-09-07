import React from 'react';
import { Target, MapPin, CheckCircle2, ChevronRight, Award, ShieldAlert } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_TARGETS } from '../services/fixtures';
import { Link } from 'react-router-dom';

export const DrillPlanning: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge 
        type="banner" 
        isReal={true} 
        message="REAL GEOSPATIAL TARGET RANKING — Balaghat Candidates extracted from High-Prospectivity & Low-Uncertainty Polygons" 
      />

      {/* Page Title Banner */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-500" />
            <span>DIAMOND CORE DRILLING SITE SELECTION</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Drill Target AI & Priority Execution Queue
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Multi-criteria ranked targets extracted from high-prospectivity & low-uncertainty watershed polygons.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Optimization Policy</p>
          <p className="text-slate-300">Max Geological Support / Min Cost</p>
        </div>
      </div>

      {/* Targets Data Table */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3">
          Ranked Candidate Target List (Balaghat Manganese Belt)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#0B192C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Target ID</th>
                <th className="py-3 px-4">Geological Support</th>
                <th className="py-3 px-4">Mean Prospectivity</th>
                <th className="py-3 px-4">Uncertainty</th>
                <th className="py-3 px-4">Area (sq km)</th>
                <th className="py-3 px-4">Road Access</th>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {FIXTURE_TARGETS.map((target, idx) => (
                <tr key={target.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-[#1E3A8A]">#{target.priority_rank}</td>
                  <td className="py-3 px-4 font-bold text-[#0B192C]">{target.target_id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{target.geological_support}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {(target.mean_prospectivity * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {(target.uncertainty * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">{target.area_sqkm} km²</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 font-semibold">{target.accessibility}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-800">{target.priority_level}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/exploration/${target.target_id}`}
                      className="px-3 py-1 bg-[#1E3A8A] text-white rounded text-[11px] font-semibold hover:bg-[#0B192C] transition-colors inline-flex items-center gap-1"
                    >
                      <span>SHAP Analysis</span>
                      <ChevronRight className="w-3 h-3 text-amber-400" />
                    </Link>
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
