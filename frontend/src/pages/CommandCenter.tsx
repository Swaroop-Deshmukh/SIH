import React from 'react';
import { KPICard } from '../components/KPICard';
import { Map } from '../components/Map';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { TrendingUp, AlertTriangle, Cpu, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockForecast = [
  { day: 'Day 1', target: 7140, forecast: 6800 },
  { day: 'Day 2', target: 7140, forecast: 6720 },
  { day: 'Day 3', target: 7140, forecast: 6650 },
  { day: 'Day 4', target: 7140, forecast: 6580 },
  { day: 'Day 5', target: 7140, forecast: 6500 },
  { day: 'Day 6', target: 7140, forecast: 6480 },
  { day: 'Day 7', target: 7140, forecast: 6470 },
];

export const CommandCenter: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Production vs Target"
          value="92.4"
          unit="%"
          subtitle="46,200 t of 50,000 t target"
          trend="down"
          trendValue="3,800 t deficit"
          status="warning"
          isPrototype
          icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
        />
        <KPICard
          title="Shortfall Risk"
          value="78"
          unit="%"
          subtitle="ShortfallShield: 7-Day Window"
          status="danger"
          isPrototype
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
        />
        <KPICard
          title="Equipment Availability"
          value="84.2"
          unit="%"
          subtitle="1 unit in breakdown anomaly"
          trend="down"
          trendValue="-3.1% vs avg"
          status="warning"
          isPrototype
          icon={<Cpu className="w-4 h-4 text-amber-400" />}
        />
        <KPICard
          title="Priority Drill Targets"
          value="12"
          unit="Candidates"
          subtitle="Top: MN-042 (0.91 prospectivity)"
          status="ok"
          isPrototype
          icon={<Target className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* Main Map & Priority Targets Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[460px]">
        {/* Map Column */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Balaghat Regional Spatial Command Map
            </h3>
            <span className="text-xs text-slate-400">MapLibre GL JS Base</span>
          </div>
          <div className="flex-1 min-h-[380px]">
            <Map />
          </div>
        </div>

        {/* High Priority Exploration Targets List */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Candidate Exploration Targets
              </h3>
              <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded font-bold">
                DrillTarget AI
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {[
                { id: 'MN-042', prospectivity: '0.910', uncertainty: '0.18', priority: 'VERY HIGH', action: 'Ground Geological Survey' },
                { id: 'MN-018', prospectivity: '0.872', uncertainty: '0.22', priority: 'HIGH', action: 'Geophysical Survey' },
                { id: 'MN-074', prospectivity: '0.823', uncertainty: '0.31', priority: 'HIGH', action: 'Geochemical Sampling' },
              ].map((t) => (
                <div key={t.id} className="p-3 bg-brand-card/50 border border-brand-border/60 rounded-lg hover:border-brand-accent/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white tracking-wider">{t.id}</span>
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Score: <strong className="text-white">{t.prospectivity}</strong></span>
                    <span>Uncertainty: <strong className="text-slate-300">{t.uncertainty}</strong></span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    <span className="text-brand-accent">Next:</span> {t.action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Model v0.1-prototype</span>
            <button className="text-brand-accent hover:underline text-xs font-semibold">
              Explore All 12 →
            </button>
          </div>
        </div>
      </div>

      {/* Production Forecast Chart & Active Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                7-Day Production Forecast vs Daily Target
              </h3>
              <p className="text-xs text-slate-400">RandomForest Regressor prototype model prediction</p>
            </div>
            <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded font-semibold">
              Projected Deficit: 3,800 t
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3B58" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[6000, 7500]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121B2C', borderColor: '#2A3B58', fontSize: '12px' }}
                />
                <Bar dataKey="target" name="Daily Target (t)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" name="Forecast (t)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active AI Risk Center Summary */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
              Active Operational Risks
            </h3>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs">
                <div className="flex items-center justify-between font-semibold text-red-400 mb-1">
                  <span>🔴 Production Shortfall Risk</span>
                  <span>78%</span>
                </div>
                <p className="text-slate-300 text-[11px]">Primary model signal: Haulage bottleneck (cycle +18%)</p>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs">
                <div className="flex items-center justify-between font-semibold text-amber-400 mb-1">
                  <span>🟠 Equipment Anomaly</span>
                  <span>EX-104</span>
                </div>
                <p className="text-slate-300 text-[11px]">CAT 777G elevated idle/downtime pattern detected</p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-600 bg-slate-800/40 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
                  <span>🟡 Weather Impact</span>
                  <span>Low Risk</span>
                </div>
                <p className="text-slate-400 text-[11px]">Balaghat dry spell; minimal precipitation delay</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border/60">
            <button className="w-full py-2 bg-brand-card hover:bg-slate-700/60 text-slate-200 border border-brand-border rounded-lg text-xs font-semibold transition-colors">
              Open Decision Engine Recommendations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
