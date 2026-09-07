import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity, BarChart2 } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_PRODUCTION_SUMMARY, FIXTURE_FORECAST, FIXTURE_SHORTFALL } from '../services/fixtures';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Production: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" message="PROTOTYPE SIMULATION DATA — ShortfallShield Ore Production Forecasting" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>MOIL PRODUCTION INTELLIGENCE & SHORTFALLSHIELD</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            30-60-90 Day Ore Production Forecasting
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            XGBoost regressor time-series forecasting & early warning shortfall risk classifier.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Monthly Target Achievement</p>
          <p className="text-xl font-extrabold text-white">{FIXTURE_PRODUCTION_SUMMARY.achievement_pct}%</p>
        </div>
      </div>

      {/* Production Chart */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>7-Day Ore Output Forecast (Daily Tonnes)</span>
          <span className="text-xs font-normal text-slate-500">XGBoost Regressor Model</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FIXTURE_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', fontSize: '12px' }} />
              <Area type="monotone" dataKey="target" stroke="#64748B" fill="#F1F5F9" name="Target Tons" />
              <Area type="monotone" dataKey="forecast" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.2} name="Forecast Tons" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shortfall Alerts Table */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>ShortfallShield Active Risk Warning</span>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">High Risk Alert</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#0B192C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Mine Site</th>
                <th className="py-3 px-4">Prediction Date</th>
                <th className="py-3 px-4">Forecast Period</th>
                <th className="py-3 px-4">Target Tonnes</th>
                <th className="py-3 px-4">Expected Deficit</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-[#0B192C]">{FIXTURE_SHORTFALL.mine_name}</td>
                <td className="py-3 px-4 font-mono">{FIXTURE_SHORTFALL.prediction_date}</td>
                <td className="py-3 px-4">{FIXTURE_SHORTFALL.forecast_period_days} Days</td>
                <td className="py-3 px-4 font-mono">{FIXTURE_SHORTFALL.target_tonnes.toLocaleString()} Tons</td>
                <td className="py-3 px-4 font-bold text-red-700">-{FIXTURE_SHORTFALL.expected_gap_tonnes.toLocaleString()} Tons</td>
                <td className="py-3 px-4">
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                    {FIXTURE_SHORTFALL.risk_level}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#1E3A8A]">{(FIXTURE_SHORTFALL.risk_score * 100).toFixed(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
