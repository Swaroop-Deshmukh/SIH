import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_RECOMMENDATIONS } from '../services/fixtures';
import { Recommendation } from '../types';
import { Brain, Check, X, ShieldAlert, Cpu, Filter, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const DecisionCenter: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(FIXTURE_RECOMMENDATIONS);
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [auditLog, setAuditLog] = useState<Array<{ id: string; action: string; timestamp: string; status: string }>>([]);

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const target = recommendations.find(r => r.id === id);
    if (target) {
      setAuditLog(prev => [
        {
          id: target.recommendation_id,
          action: target.action,
          timestamp: new Date().toLocaleTimeString(),
          status: newStatus
        },
        ...prev
      ]);
    }
  };

  const filteredRecs = recommendations.filter(r => 
    actionFilter === 'ALL' || r.action_type === actionFilter
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Human-in-the-Loop Protocol Header */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 rounded-lg bg-brand-accent/20 text-brand-accent flex-shrink-0">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white mb-1">
            Human-in-the-Loop AI Decision Support Engine
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            MnVision 360 converges ShortfallShield risks, MineTwin operational readiness scores, and OR-Tools scheduling optimization. 
            <strong className="text-slate-200"> All recommendations are strictly non-autonomous advisories requiring MOIL mining and geological engineer authorization before deployment.</strong>
          </p>
        </div>
      </div>

      {/* Filter and Audit Controls */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Advisory Category:</span>
          {['ALL', 'BLOCK_ACTIVATE', 'SURVEY_PRIORITY', 'MAINTENANCE'].map(cat => (
            <button
              key={cat}
              onClick={() => setActionFilter(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-colors ${
                actionFilter === cat
                  ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                  : 'bg-brand-dark text-slate-400 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Pending Approvals: <strong className="text-brand-accent">{recommendations.filter(r => r.status === 'PENDING_REVIEW').length}</strong>
        </span>
      </div>

      {/* Active Advisories Queue */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => (
          <div key={rec.id} className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-accent/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-accent bg-brand-accent/15 px-2 py-0.5 rounded border border-brand-accent/30 font-mono">
                  {rec.action_type}
                </span>
                <span className="text-xs text-slate-400 font-mono">{rec.recommendation_id}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                rec.status === 'APPROVED'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : rec.status === 'REJECTED'
                  ? 'text-red-400 bg-red-500/10 border-red-500/30'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              }`}>
                {rec.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-2">{rec.action}</h3>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">{rec.reason}</p>
            <p className="text-xs text-emerald-400 font-medium mb-4">
              <strong>Anticipated Mitigation Benefit:</strong> {rec.expected_benefit}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/60">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Model Recommendation Confidence:</span>
                <div className="w-24 bg-brand-dark rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-accent h-full" style={{ width: `${rec.confidence * 100}%` }} />
                </div>
                <span className="font-bold text-white">{(rec.confidence * 100).toFixed(0)}%</span>
              </div>

              {rec.status === 'PENDING_REVIEW' ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(rec.id, 'APPROVED')}
                    className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Advisory
                  </button>
                  <button 
                    onClick={() => handleAction(rec.id, 'REJECTED')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400 italic">
                  Decision recorded by engineer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Engineer Audit Trail Log */}
      {auditLog.length > 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Real-Time Engineer Decision Audit Trail
          </h4>
          <div className="space-y-2">
            {auditLog.map((log, idx) => (
              <div key={idx} className="p-2.5 bg-brand-dark rounded-lg flex items-center justify-between text-xs text-slate-300 border border-brand-border/60">
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${log.status === 'APPROVED' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <strong className="text-white font-mono">{log.id}</strong>: <span className="truncate">{log.action}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold text-[10px] uppercase ${log.status === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {log.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
