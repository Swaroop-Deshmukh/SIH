import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('ops_manager');
  const [password, setPassword] = useState('MoilOps@2026!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login: authContextLogin, getDefaultDashboard } = useAuth();
  const navigate = useNavigate();

  const handlePresetSelect = (presetUsername: string, presetPass: string) => {
    setUsername(presetUsername);
    setPassword(presetPass);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Invalid username or password');
      }

      const tokenData = await res.json();
      
      // Save authenticated user & token in central AuthContext
      authContextLogin(tokenData.access_token, {
        username: tokenData.user.username,
        role: tokenData.user.role,
        full_name: tokenData.user.full_name,
        email: tokenData.user.email,
      });

      // Navigate to authorized default role dashboard
      const targetDashboard = getDefaultDashboard(tokenData.user.role);
      navigate(targetDashboard);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#003366] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Radial Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#D4AF37] p-8 relative z-10 space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#003366] text-[#D4AF37] mx-auto flex flex-col items-center justify-center border-2 border-[#D4AF37] shadow-lg">
            <span className="text-xs font-black tracking-widest leading-none">MOIL</span>
            <span className="text-[9px] font-bold text-white tracking-tighter">LIMITED</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#003366] font-serif tracking-tight">
            MnVision 360
          </h1>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
            MOIL Space-to-Mine Intelligence Platform
          </p>
          <div className="inline-flex items-center gap-1 bg-blue-50 text-[#003366] text-[10px] px-2.5 py-0.5 rounded font-bold border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span>Secure Government JWT & Backend Derived RBAC</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Role Selector Presets (Sets Username & Pass, Backend resolves Role) */}
        <div className="space-y-1 text-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Pre-Seeded Government Test Credentials:
          </p>
          <div className="grid grid-cols-2 gap-1.5 font-sans text-[11px]">
            <button
              type="button"
              onClick={() => handlePresetSelect('admin', 'MoilAdmin@2026!')}
              className={`p-2 rounded border text-left font-bold transition ${username === 'admin' ? 'bg-[#003366] text-white border-[#D4AF37]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              👑 Admin (admin)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('ops_manager', 'MoilOps@2026!')}
              className={`p-2 rounded border text-left font-bold transition ${username === 'ops_manager' ? 'bg-[#003366] text-white border-[#D4AF37]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              ⚙️ Ops Manager (ops_manager)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('geologist', 'MoilGeo@2026!')}
              className={`p-2 rounded border text-left font-bold transition ${username === 'geologist' ? 'bg-[#003366] text-white border-[#D4AF37]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              🔬 Geologist (geologist)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('field_officer', 'MoilField@2026!')}
              className={`p-2 rounded border text-left font-bold transition ${username === 'field_officer' ? 'bg-[#003366] text-white border-[#D4AF37]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              📋 Field Officer (field_officer)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#003366]" />
              <span>Username / Official ID</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#003366]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:border-[#003366]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#003366] hover:bg-[#002855] text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 border border-amber-400/50 mt-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'AUTHENTICATING WITH BACKEND...' : 'AUTHORIZE & ENTER PORTAL'}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
          🔒 HTTPS Encrypted • Nginx Gateway • JWT Token Auth • MOIL Network
        </div>
      </div>
    </div>
  );
};
