import React from 'react';
import { ShieldCheck, Lock, Activity, Users, AlertOctagon, CheckCircle2, Server } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';

export const Security: React.FC = () => {
  const auditLogs = [
    { id: '1', timestamp: '2026-09-07 20:48:12', user: 'aryan.deshmukh (Ops Manager)', action: 'SIMULATED ACTIVATION Block B-17 (+720t ore recovery)', status: 'APPROVED' },
    { id: '2', timestamp: '2026-09-07 20:45:01', user: 'priya.sharma (Geologist)', action: 'EXPORTED SHAP EXPLANATION Target MN-042', status: 'SUCCESS' },
    { id: '3', timestamp: '2026-09-07 20:30:44', user: 'ramesh.verma (Field Officer)', action: 'SYNCHRONIZED PWA SAMPLE RECORD MOIL-SURVEY-092', status: 'SUCCESS' },
    { id: '4', timestamp: '2026-09-07 19:12:05', user: 'Unknown IP (10.66.169.45)', action: 'JWT AUTHENTICATION FAILED (Invalid Password)', status: 'BLOCKED' },
    { id: '5', timestamp: '2026-09-07 18:55:30', user: 'system.admin', action: 'EXECUTED SpatialBlockCV XGBoost Retraining', status: 'COMPLETED' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge 
        type="banner" 
        isReal={true} 
        message="GOVERNMENT SECURITY CENTER — Nginx Reverse Proxy Gateway, JWT Authentication & RBAC Audit Stream" 
      />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>MOIL ENTERPRISE SECURITY & AUDIT CONTROL</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] font-serif mt-1">
            Security & Compliance Operations Center
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Role-Based Access Control (RBAC), JWT authentication, network infrastructure health, and real-time audit event logs.
          </p>
        </div>
        <div className="bg-[#003366] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-300 font-bold">Security Status</p>
          <p className="text-emerald-400 font-bold">🟢 SECURE (0 Threats)</p>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Active Sessions</span>
            <Users className="w-4 h-4 text-[#003366]" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">18 Users</p>
          <p className="text-[11px] text-slate-500">JWT Tokens Validated</p>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Failed Logins (24h)</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700">3 Attempts</p>
          <p className="text-[11px] text-slate-500">Rate Limited & Logged</p>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Blocked Threats</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">7 Requests</p>
          <p className="text-[11px] text-slate-500">Nginx WAF Rule Match</p>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>API Request Volume</span>
            <Activity className="w-4 h-4 text-[#003366]" />
          </div>
          <p className="text-2xl font-extrabold text-[#003366]">842 / min</p>
          <p className="text-[11px] text-slate-500">FastAPI Gateway Active</p>
        </div>
      </div>

      {/* Network Infrastructure Health */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3 flex items-center justify-between">
          <span>Infrastructure Network Topology Health</span>
          <span className="text-xs font-mono text-emerald-700 font-bold">All 7 Docker Microservices Online</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <span>Nginx SSL</span>
            <span className="text-emerald-700 font-bold">🟢 ONLINE</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <span>FastAPI Gateway</span>
            <span className="text-emerald-700 font-bold">🟢 ONLINE</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <span>PostGIS Database</span>
            <span className="text-emerald-700 font-bold">🔒 INTERNAL</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <span>ML Services Engine</span>
            <span className="text-emerald-700 font-bold">🔒 INTERNAL</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <span>MinIO Storage</span>
            <span className="text-emerald-700 font-bold">🔒 INTERNAL</span>
          </div>
        </div>
      </div>

      {/* Real-time Audit Events Log */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#003366] font-serif border-b border-slate-200 pb-3">
          Real-time System Audit Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[#003366] font-bold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User Principal</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Audit Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-[#003366]">{log.user}</td>
                  <td className="py-2.5 px-3 text-slate-900">{log.action}</td>
                  <td className="py-2.5 px-3 font-bold">
                    {log.status === 'BLOCKED' ? (
                      <span className="text-red-700">🔴 {log.status}</span>
                    ) : (
                      <span className="text-emerald-700">🟢 {log.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
