import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity, BarChart2, Zap, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_PRODUCTION_SUMMARY, FIXTURE_FORECAST, FIXTURE_SHORTFALL } from '../services/fixtures';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Production: React.FC = () => {
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [simulatedOption, setSimulatedOption] = useState<'current' | 'b17'>('current');
  const [isApplied, setIsApplied] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — ShortfallShield Ore Production Forecasting" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>MOIL PRODUCTION INTELLIGENCE & SHORTFALLSHIELD</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] font-serif mt-1">
            30-60-90 Day Ore Production Forecasting & Shortfall Shield
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            XGBoost regressor time-series forecasting & early warning shortfall risk classifier.
          </p>
        </div>
        <div className="bg-[#003366] text-white p-3 rounded text-xs font-mono border-l-2 border-[#D4AF37]">
          <p className="text-[#D4AF37] font-bold">Monthly Target Achievement</p>
          <p className="text-xl font-extrabold text-white">{FIXTURE_PRODUCTION_SUMMARY.achievement_pct}%</p>
        </div>
      </div>

      {/* Shortfall Risk Center & Cause Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shortfall Risk Summary Card */}
        <div className="bg-red-50/60 border-l-4 border-red-600 border border-red-200 rounded p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
              <span className="font-extrabold text-xs text-red-900 uppercase tracking-wide">Shortfall Risk Center</span>
            </div>
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
              84% PROBABILITY 🔴
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-600 font-medium">Predicted Daily Output Deficit</div>
            <div className="text-3xl font-extrabold text-red-700 font-serif mt-0.5">
              {isApplied ? '0 Tons / Day (MITIGATED)' : '-550 Tons / Day'}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              {isApplied ? 'Block B-17 activation (+620 T/day) offset deficit completely.' : 'Balaghat Pit #2 Haulage Delay & Stope Maintenance.'}
            </div>
          </div>

          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="w-full bg-[#003366] text-white py-2.5 px-4 rounded text-xs font-bold hover:bg-[#002244] transition flex items-center justify-center gap-2 border border-[#D4AF37]"
          >
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            [ SIMULATE MITIGATION OPTIONS ]
          </button>
        </div>

        {/* SHAP Cause Breakdown */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#003366] font-serif border-b border-slate-200 pb-2 flex items-center justify-between">
            <span>Shortfall Root-Cause SHAP Attribution Breakdown</span>
            <span className="text-[11px] text-slate-500 font-mono">XGBoost ML Classifier</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>3-Day Rolling Production Average Decline</span>
                <span className="text-red-700 font-bold">+24% Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Equipment Downtime (EX-104 Haul Truck Anomaly)</span>
                <span className="text-red-700 font-bold">+19% Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Underground Stope Development Delay</span>
                <span className="text-amber-700 font-bold">+13% Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Ore Grade Variance (Mansar Layer)</span>
                <span className="text-slate-700 font-bold">+9% Contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>7-Day Ore Output Forecast vs Target (Daily Tonnes)</span>
          <span className="text-xs font-normal text-slate-500">XGBoost / HGB Time-Series Model</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FIXTURE_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', fontSize: '12px' }} />
              <Area type="monotone" dataKey="target" stroke="#64748B" fill="#F1F5F9" name="Target Tons" />
              <Area type="monotone" dataKey="forecast" stroke="#003366" fill="#003366" fillOpacity={0.2} name="Forecast Tons" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Simulation Options Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Shortfall Mitigation Scenario Simulator
                </h3>
              </div>
              <button onClick={() => setIsSimulateModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <p className="text-slate-600">
                Compare short-term options to eliminate the predicted <strong>550 Tonnes/Day</strong> shortfall at Balaghat.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A */}
                <div
                  onClick={() => setSimulatedOption('current')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    simulatedOption === 'current' ? 'border-red-600 bg-red-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-red-700 uppercase tracking-wide text-[11px]">Option A: Status Quo (Current)</span>
                    {simulatedOption === 'current' && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">-550 t/day Deficit</div>
                  <div className="mt-2 text-red-800 font-bold text-[11px] bg-red-100 px-2 py-0.5 rounded inline-block">
                    84% Shortfall Risk Probability 🔴
                  </div>
                  
                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-700 border-t border-slate-200 pt-2 font-sans">
                    <p className="font-bold text-red-900">Why Risk is High:</p>
                    <p>• <strong>Pit #2 Haul Road Waterlogging</strong>: Monsoon runoff slows CAT 777G dumpers (-35% cycle speed).</p>
                    <p>• <strong>EX-104 Dumper Breakdown</strong>: Isolation Forest hydraulic alarm (-420 t/day output).</p>
                    <p>• <strong>Stope 4B Stoppage</strong>: Ventilation blast delay holds back face extraction.</p>
                    <p>• <strong>Penalty</strong>: Accumulates <strong>-₹42 Lakhs/week</strong> revenue penalty.</p>
                  </div>
                </div>

                {/* Option B */}
                <div
                  onClick={() => setSimulatedOption('b17')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    simulatedOption === 'b17' ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-emerald-800 uppercase tracking-wide text-[11px]">Option B: Activate Block B-17 (Recommended)</span>
                    {simulatedOption === 'b17' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 font-mono">+620 t/day Yield</div>
                  <div className="mt-2 text-emerald-900 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded inline-block">
                    100% Deficit Coverage (+70 t Surplus) 🟢
                  </div>

                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-700 border-t border-slate-200 pt-2 font-sans">
                    <p className="font-bold text-emerald-900">Why Option B is Best:</p>
                    <p>• <strong>Tonnage Offset</strong>: Injects <strong>+620 t/day</strong>, completely covering 550 t deficit.</p>
                    <p>• <strong>Grade Uplift</strong>: Premium <strong>32.7% Mn (+1.5% higher grade)</strong> ore quality.</p>
                    <p>• <strong>Zero Flood Risk</strong>: Level 6 underground reserve is 100% dry (Water Risk: LOW).</p>
                    <p>• <strong>Low Setup Cost</strong>: Pre-drilled & ready (80% development); setup cost is only <strong>₹18.5 Lakhs</strong> (48h ramp-up).</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">
                  Recommendation Engine: <strong>Option B Selected by OR-Tools Solver</strong>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSimulateModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded font-bold hover:bg-slate-100 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsApplied(true);
                      setIsSimulateModalOpen(false);
                    }}
                    className="px-5 py-2 bg-[#003366] text-white font-bold rounded hover:bg-[#002244] border border-[#D4AF37] shadow transition flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    APPLY OPTION B SCENARIO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

