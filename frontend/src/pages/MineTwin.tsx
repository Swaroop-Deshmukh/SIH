import React, { useState } from 'react';
import { Building2, Layers, CheckCircle2, ShieldAlert, ChevronRight, Activity, Zap, Check, AlertTriangle, X } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_MINES, FIXTURE_BLOCKS } from '../services/fixtures';
import { MineBlock } from '../types';

export const MineTwin: React.FC = () => {
  const [selectedMine, setSelectedMine] = useState(FIXTURE_MINES[0]);
  const [blocks, setBlocks] = useState<MineBlock[]>(FIXTURE_BLOCKS);
  const [activeModalBlock, setActiveModalBlock] = useState<MineBlock | null>(null);
  const [activationSuccessMsg, setActivationSuccessMsg] = useState<string | null>(null);

  const handleActivateBlock = (block: MineBlock) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === block.id
          ? {
              ...b,
              block_status: 'ACTIVATED',
              readiness_score: 98,
              blasting_readiness: 'READY'
            }
          : b
      )
    );
    setActiveModalBlock(null);
    setActivationSuccessMsg(`Block ${block.block_code} successfully activated! +620 T/day injected into Balaghat production pipeline.`);
    setTimeout(() => setActivationSuccessMsg(null), 6000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — MineTwin Block Model & Mine Readiness Matrix" />

      {/* Success Notification Banner */}
      {activationSuccessMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-bold text-emerald-900">{activationSuccessMsg}</p>
          </div>
          <button onClick={() => setActivationSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>MOIL UNDERGROUND & OPEN PIT MINE DIGITAL TWIN</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] font-serif mt-1">
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
                  ? 'bg-[#003366] text-white shadow-sm'
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
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Active Mine Faces & Block Model ({selectedMine.mine_name})</span>
          <span className="text-xs font-normal text-slate-500 font-mono">EPSG:32644 (UTM 44N)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#003366] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Block Code</th>
                <th className="py-3 px-4">Est. Ore Tonnes</th>
                <th className="py-3 px-4">Mn Grade (%)</th>
                <th className="py-3 px-4">Fe Grade (%)</th>
                <th className="py-3 px-4">Development (%)</th>
                <th className="py-3 px-4">Blasting Readiness</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {blocks.map((block) => (
                <tr key={block.id} className={`hover:bg-slate-50 ${block.block_code === 'B-17' ? 'bg-amber-50/50' : ''}`}>
                  <td className="py-3 px-4 font-bold text-[#003366] flex items-center gap-1.5">
                    <span>{block.block_code}</span>
                    {block.block_code === 'B-17' && (
                      <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-extrabold">RESERVE</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">{block.estimated_ore_tonnes.toLocaleString()} Tons</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{block.estimated_grade_pct}% Mn</td>
                  <td className="py-3 px-4 font-mono">{block.fe_grade_pct || '6.5'}% Fe</td>
                  <td className="py-3 px-4">{block.development_percent}%</td>
                  <td className="py-3 px-4">
                    <span className={block.blasting_readiness === 'READY' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                      {block.blasting_readiness}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      block.readiness_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {block.readiness_score}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#003366]">{block.block_status}</td>
                  <td className="py-3 px-4 text-center">
                    {block.block_status.includes('ACTIVATED') ? (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> Live
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveModalBlock(block)}
                        className="bg-[#003366] hover:bg-[#002244] text-white px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 mx-auto"
                      >
                        <Zap className="w-3 h-3 text-[#D4AF37]" />
                        Simulate Activation
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Activation Simulation Modal */}
      {activeModalBlock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Simulate Block Activation — {activeModalBlock.block_code}
                </h3>
              </div>
              <button onClick={() => setActiveModalBlock(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>MOIL Operational Dispatch Scenario</span>
                </div>
                <p>
                  Activating underground reserve <strong>Block {activeModalBlock.block_code}</strong> will override current scheduling to compensate for Balaghat pit shortfall.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Ore Production Output</div>
                  <div className="text-base font-extrabold text-[#003366] mt-0.5">+620 Tons / Day</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Mn Grade: {activeModalBlock.estimated_grade_pct}% (+1.5% uplift)</div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Shortfall Risk Offset</div>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">100% Deficit Coverage</div>
                  <div className="text-[10px] text-slate-600 font-medium">48h Setup & Transport Time</div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Estimated Activation Cost</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">₹18.5 Lakhs</div>
                  <div className="text-[10px] text-slate-500">Haulage & ventilation ramp-up</div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Geotechnical Risk</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">Low (Score: 0.12)</div>
                  <div className="text-[10px] text-slate-500">Roof stability verified</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  onClick={() => setActiveModalBlock(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleActivateBlock(activeModalBlock)}
                  className="px-5 py-2 bg-[#003366] text-white font-bold rounded hover:bg-[#002244] border border-[#D4AF37] shadow transition flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-[#D4AF37]" />
                  CONFIRM SIMULATED ACTIVATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

