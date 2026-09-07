import React, { useState } from 'react';
import { Brain, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck, Landmark, Zap, Check, X } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_RECOMMENDATIONS } from '../services/fixtures';
import { Recommendation } from '../types';

export const DecisionCenter: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(FIXTURE_RECOMMENDATIONS);
  const [selectedRecModal, setSelectedRecModal] = useState<Recommendation | null>(null);
  const [dispatchedSuccessMsg, setDispatchedSuccessMsg] = useState<string | null>(null);

  const handleApproveRecommendation = (rec: Recommendation) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'APPROVED' } : r))
    );
    setSelectedRecModal(null);
    setDispatchedSuccessMsg(`Recommendation ${rec.recommendation_id} successfully APPROVED & dispatched to MOIL Operations Command!`);
    setTimeout(() => setDispatchedSuccessMsg(null), 6000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — Google OR-Tools Decision Support Engine" />

      {/* Dispatch Success Alert */}
      {dispatchedSuccessMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-bold text-emerald-900">{dispatchedSuccessMsg}</p>
          </div>
          <button onClick={() => setDispatchedSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
            <Brain className="w-4 h-4 text-amber-500" />
            <span>MOIL MULTI-OBJECTIVE RESOURCE OPTIMIZATION</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] font-serif mt-1">
            Decision Support & Recommendation Engine
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Google OR-Tools Mixed Integer Programming (MIP) solver generating human-reviewable recommendations.
          </p>
        </div>
        <div className="bg-[#003366] text-white p-3 rounded text-xs font-mono border-l-2 border-[#D4AF37]">
          <p className="text-[#D4AF37] font-bold">Human-in-the-Loop</p>
          <p className="text-slate-300">Mandatory Engineering Review</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Active Optimization Recommendations</span>
          <span className="text-xs font-bold text-[#003366]">OR-Tools Solver v1.0</span>
        </h3>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 bg-slate-50 border-l-4 border-[#003366] border border-slate-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#003366] uppercase tracking-wider">{rec.action_type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {(rec.confidence * 100).toFixed(0)}% Confidence
                  </span>
                  {rec.status === 'APPROVED' && (
                    <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> APPROVED
                    </span>
                  )}
                </div>
              </div>
              <h4 className="font-bold text-[#003366] text-sm">{rec.action}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{rec.reason}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
                <span>Expected Benefit: <strong className="text-emerald-700">{rec.expected_benefit}</strong></span>
                {rec.status === 'APPROVED' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Dispatched to Field
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedRecModal(rec)}
                    className="px-4 py-1.5 bg-[#003366] text-white rounded text-xs font-bold hover:bg-[#002244] border border-[#D4AF37] transition flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Review & Dispatch Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Review Modal */}
      {selectedRecModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Review & Approve Plan — {selectedRecModal.recommendation_id}
                </h3>
              </div>
              <button onClick={() => setSelectedRecModal(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
                <div className="font-bold text-[#003366] text-sm">{selectedRecModal.action}</div>
                <p className="text-slate-600 leading-relaxed">{selectedRecModal.reason}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-900 font-medium">
                <strong>Expected Impact:</strong> {selectedRecModal.expected_benefit}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRecModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveRecommendation(selectedRecModal)}
                  className="px-5 py-2 bg-[#003366] text-white font-bold rounded hover:bg-[#002244] border border-[#D4AF37] shadow transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  APPROVE & DISPATCH TO FIELD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

