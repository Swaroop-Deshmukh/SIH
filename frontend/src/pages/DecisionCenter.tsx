import React from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Brain, Check, X, ShieldAlert, Cpu } from 'lucide-react';

export const DecisionCenter: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Human-in-the-loop Protocol Alert */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-brand-accent/20 text-brand-accent flex-shrink-0">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white mb-1">
            Human-in-the-Loop AI Decision Engine
          </h2>
          <p className="text-xs text-slate-400">
            MnVision 360 generates decision-support advisories by converging ShortfallShield risk, MineTwin block readiness, and Google OR-Tools optimization. 
            <strong className="text-slate-200"> All recommendations require MOIL engineer review and authorization before field execution.</strong>
          </p>
        </div>
      </div>

      {/* Active Advisories Queue */}
      <div className="space-y-4">
        {[
          {
            id: 'REC-2026-001',
            type: 'OPERATIONAL RESCHEDULING',
            title: 'Evaluate activation of alternate production block A-12',
            reason: 'Current 7-day shortfall risk is 78% with a 3,800 t deficit at BLG-01. Block A-12 is 94% operationally ready with cleared haulage routes and active equipment.',
            benefit: 'Estimated mitigation of 2,000 to 3,500 t in production deficit.',
            confidence: 78,
            status: 'PENDING_REVIEW'
          },
          {
            id: 'REC-2026-002',
            type: 'EXPLORATION SURVEY',
            title: 'Prioritize ground geological reconnaissance at target MN-042',
            reason: 'High multi-source prospectivity (0.910) backed by favourable Precambrian lithology and lineament intersections. Ground assay needed to validate surface spectral response.',
            benefit: 'Target uncertainty reduction from 0.180 to ~0.100.',
            confidence: 82,
            status: 'PENDING_REVIEW'
          },
          {
            id: 'REC-2026-003',
            type: 'PREVENTIVE MAINTENANCE',
            title: 'Schedule immediate maintenance overhaul on haulage unit EX-104',
            reason: 'Isolation Forest flagged severe idle pattern anomaly (score: 0.84). Running unit risks unplanned stoppage during high-output shift.',
            benefit: 'Prevents estimated 18-hour catastrophic downtime event.',
            confidence: 71,
            status: 'PENDING_REVIEW'
          }
        ].map((rec) => (
          <div key={rec.id} className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-accent/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-accent bg-brand-accent/15 px-2 py-0.5 rounded border border-brand-accent/30">
                  {rec.type}
                </span>
                <span className="text-xs text-slate-400">{rec.id}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {rec.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-2">{rec.title}</h3>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">{rec.reason}</p>
            <p className="text-xs text-emerald-400 font-medium mb-4">
              <strong>Projected Benefit:</strong> {rec.benefit}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/60">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Model Confidence:</span>
                <div className="w-24 bg-brand-dark rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-accent h-full" style={{ width: `${rec.confidence}%` }} />
                </div>
                <span className="font-bold text-white">{rec.confidence}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert(`Recommendation ${rec.id} approved. Logged to audit trail.`)}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve Advisory
                </button>
                <button 
                  onClick={() => alert(`Recommendation ${rec.id} rejected.`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
