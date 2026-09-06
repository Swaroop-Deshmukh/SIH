import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_MINES, FIXTURE_BLOCKS } from '../services/fixtures';
import { Building2, CheckCircle2, Clock, HardHat, Filter, Layers, Pickaxe, Activity } from 'lucide-react';

export const MineTwin: React.FC = () => {
  const [selectedMineId, setSelectedMineId] = useState<string>(FIXTURE_MINES[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewTab, setViewTab] = useState<'blocks' | 'mines' | 'readiness'>('blocks');

  const activeMine = FIXTURE_MINES.find(m => m.id === selectedMineId) || FIXTURE_MINES[0];
  
  const mineBlocks = FIXTURE_BLOCKS.filter(b => b.mine_id === selectedMineId);
  const filteredBlocks = mineBlocks.filter(b => statusFilter === 'ALL' || b.block_status === statusFilter);

  const totalTonnage = mineBlocks.reduce((acc, b) => acc + b.estimated_ore_tonnes, 0);
  const readyTonnage = mineBlocks.filter(b => b.block_status === 'READY' || b.block_status === 'PRODUCING')
                                 .reduce((acc, b) => acc + b.estimated_ore_tonnes, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Core Principle Header */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-accent" />
            MineTwin AI — Operational Ore Readiness Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enforcing the MOIL structural distinction: <span className="text-brand-accent font-semibold">Reserve ≠ Mineable Ore ≠ Operationally Ready Ore</span>
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-brand-dark p-1 rounded-lg border border-brand-border">
          {[
            { id: 'blocks', label: 'Production Blocks' },
            { id: 'mines', label: 'Mine Directory' },
            { id: 'readiness', label: 'Readiness Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id as any)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewTab === tab.id ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {viewTab === 'blocks' && (
        <div className="space-y-6">
          {/* Mine Selector & Summary Bar */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-400">Lease:</label>
              <select
                value={selectedMineId}
                onChange={(e) => setSelectedMineId(e.target.value)}
                className="bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-brand-accent cursor-pointer"
              >
                {FIXTURE_MINES.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.mine_code} — {m.mine_name} ({m.mine_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {['ALL', 'READY', 'PRODUCING', 'DEVELOPMENT', 'BLOCKED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-colors ${
                    statusFilter === st
                      ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                      : 'text-slate-400 hover:text-slate-200 bg-brand-dark'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Mine Ore Readiness Hierarchy Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In-Situ Mineral Reserve</p>
              <p className="text-2xl font-black text-white mt-1">{(totalTonnage * 1.8).toLocaleString()} t</p>
              <p className="text-[11px] text-slate-400 mt-1">Geologically established resource boundary</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mineable Developed Ore</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{totalTonnage.toLocaleString()} t</p>
              <p className="text-[11px] text-slate-400 mt-1">Active level & stope development complete</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Operationally Ready Ore</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{readyTonnage.toLocaleString()} t</p>
              <p className="text-[11px] text-emerald-400/90 mt-1">Drilling + Blasting + Haulage cleared</p>
            </div>
          </div>

          {/* Block Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlocks.map((b) => (
              <div key={b.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:border-brand-accent/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pickaxe className="w-4 h-4 text-brand-accent" />
                    <span className="font-bold text-base text-white tracking-wider">Block {b.block_code}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                    b.block_status === 'READY' || b.block_status === 'PRODUCING'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : b.block_status === 'DEVELOPMENT'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {b.block_status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Estimated Ore Volume:</span>
                    <span className="text-white font-semibold">{b.estimated_ore_tonnes.toLocaleString()} t</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Grade (Mn% / Fe%):</span>
                    <span className="text-brand-accent font-semibold">{b.estimated_grade_pct}% / {b.fe_grade_pct}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Multi-Factor Readiness:</span>
                    <span className={`font-bold ${b.readiness_score >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {b.readiness_score}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-brand-dark rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${b.readiness_score >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${b.readiness_score}%` }}
                    />
                  </div>
                </div>

                {/* Subsystem checklist items */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-brand-border/60">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${b.development_percent >= 90 ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>Dev: {b.development_percent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${b.drilling_percent >= 90 ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>Drill: {b.drilling_percent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className={`w-3.5 h-3.5 ${b.blasting_readiness === 'READY' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span>Blast: {b.blasting_readiness}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <HardHat className={`w-3.5 h-3.5 ${b.equipment_available ? 'text-emerald-400' : 'text-red-400'}`} />
                    <span>Fleet: {b.equipment_available ? 'Allocated' : 'None'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewTab === 'mines' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">MOIL Balaghat Active Lease Portfolio</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-brand-dark text-slate-400 uppercase text-[10px] tracking-wider border-b border-brand-border">
                <tr>
                  <th className="p-3">Mine Code</th>
                  <th className="p-3">Lease Name</th>
                  <th className="p-3">Extraction Mode</th>
                  <th className="p-3">Depth</th>
                  <th className="p-3">Annual Capacity</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {FIXTURE_MINES.map(m => (
                  <tr key={m.id} className="hover:bg-brand-card/40">
                    <td className="p-3 font-bold text-white">{m.mine_code}</td>
                    <td className="p-3">{m.mine_name}</td>
                    <td className="p-3">{m.mine_type}</td>
                    <td className="p-3">{m.depth_m} m</td>
                    <td className="p-3">{m.annual_capacity_mt} MTPA</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {m.operational_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewTab === 'readiness' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 text-xs space-y-4">
          <h3 className="text-sm font-bold text-white">Readiness Calculation Matrix</h3>
          <p className="text-slate-400">
            Readiness scoring calculates operational viability across six sub-factors before a block is scheduled for extraction:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
              <p className="font-bold text-white">1. Stope Development (30%)</p>
              <p className="text-slate-400 mt-1">Cross-cuts, raises, and ore drive advance progress.</p>
            </div>
            <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
              <p className="font-bold text-white">2. Longhole Drilling (25%)</p>
              <p className="text-slate-400 mt-1">Drill meterage completion against design pattern.</p>
            </div>
            <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
              <p className="font-bold text-white">3. Blasting Readiness (20%)</p>
              <p className="text-slate-400 mt-1">Explosive charging status and perimeter clearance.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
