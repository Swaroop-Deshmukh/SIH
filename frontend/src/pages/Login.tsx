import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Lock, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin?: (user: { username: string; role: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('aryan.deshmukh');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Operations Manager');
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({ username, role });
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#0B192C] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Radial Overlay */}
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
            <span>Secure Government JWT Authentication</span>
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

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[#003366]" />
              <span>Role / Access Scoping (RBAC)</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-[#003366]"
            >
              <option value="Operations Manager">Operations Manager (Full Mine Twin & Production)</option>
              <option value="Geologist">Senior Exploration Geologist (GIS & Drill Target AI)</option>
              <option value="Field Officer">Field Officer (PWA Outcrop Survey & Offline Mode)</option>
              <option value="Administrator">Platform System Administrator (Security & Models)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#003366] hover:bg-[#002855] text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 border border-amber-400/50 mt-2"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>AUTHORIZE & ENTER PORTAL</span>
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
