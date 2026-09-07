import React from 'react';
import { Brain, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck, Landmark } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_RECOMMENDATIONS } from '../services/fixtures';

export const DecisionCenter: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — Google OR-Tools Decision Support Engine" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <Brain className="w-4 h-4 text-amber-500" />
            <span>MOIL MULTI-OBJECTIVE RESOURCE OPTIMIZATION</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Decision Support & Recommendation Engine
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Google OR-Tools MIP solver generating human-reviewable operational & exploratory recommendations.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Human-in-the-Loop</p>
          <p className="text-slate-300">Mandatory Engineering Review</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Active Optimization Recommendations</span>
          <span className="text-xs font-bold text-[#1E3A8A]">OR-Tools Solver v1.0</span>
        </h3>

        <div className="space-y-4">
          {FIXTURE_RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="p-5 bg-slate-50 border-l-4 border-[#1E3A8A] border border-slate-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1E3A8A] uppercase tracking-wider">{rec.action_type}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {(rec.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <h4 className="font-bold text-[#0B192C] text-sm">{rec.action}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{rec.reason}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
                <span>Expected Benefit: <strong className="text-emerald-700">{rec.expected_benefit}</strong></span>
                <button className="px-4 py-1.5 bg-[#1E3A8A] text-white rounded text-xs font-bold hover:bg-[#0B192C] transition-colors">
                  Approve & Dispatch Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
