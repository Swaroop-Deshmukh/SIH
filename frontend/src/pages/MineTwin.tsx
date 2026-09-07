import React, { useState } from 'react';
import { Building2, Layers, CheckCircle2, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_MINES, FIXTURE_BLOCKS } from '../services/fixtures';

export const MineTwin: React.FC = () => {
  const [selectedMine, setSelectedMine] = useState(FIXTURE_MINES[0]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — MineTwin Block Model & Mine Readiness Matrix" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>MOIL UNDERGROUND & OPEN PIT MINE DIGITAL TWIN</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            MineTwin 3D Block Model & Operational Readiness
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time block readiness scoring considering grade, strip ratio, permits, and geotechnical risk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {FIXTURE_MINES.map((mine) => (
            <button
              key={mine.id}
              onClick={() => setSelectedMine(mine)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                selectedMine.id === mine.id
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mine.mine_name}
            </button>
          ))}
        </div>
      </div>

      {/* Mine Block Model Grid */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Active Mine Faces & Block Model ({selectedMine.mine_name})</span>
          <span className="text-xs font-normal text-slate-500 font-mono">EPSG:32644 (UTM 44N)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#0B192C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Block Code</th>
                <th className="py-3 px-4">Est. Ore Tonnes</th>
                <th className="py-3 px-4">Mn Grade (%)</th>
                <th className="py-3 px-4">Fe Grade (%)</th>
                <th className="py-3 px-4">Development (%)</th>
                <th className="py-3 px-4">Blasting Readiness</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {FIXTURE_BLOCKS.map((block) => (
                <tr key={block.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-[#1E3A8A]">{block.block_code}</td>
                  <td className="py-3 px-4 font-mono">{block.estimated_ore_tonnes.toLocaleString()} Tons</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{block.estimated_grade_pct}% Mn</td>
                  <td className="py-3 px-4 font-mono">{block.fe_grade_pct || '6.5'}% Fe</td>
                  <td className="py-3 px-4">{block.development_percent}%</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 font-semibold">{block.blasting_readiness}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {block.readiness_score}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0B192C]">{block.block_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
