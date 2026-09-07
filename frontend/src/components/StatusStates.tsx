import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

interface StateProps {
  message?: string;
  onRetry?: () => void;
}

export const LoadingState: React.FC<StateProps> = ({ message = 'Loading geospatial data & records...' }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded border border-slate-200 shadow-sm text-center">
    <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin mb-3" />
    <p className="text-sm font-semibold text-slate-700">{message}</p>
    <p className="text-xs text-slate-400 mt-1">MOIL MnVision 360 GIS System</p>
  </div>
);

export const EmptyState: React.FC<StateProps> = ({ message = 'No data available for the selected criteria.' }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded border border-slate-200 shadow-sm text-center">
    <Inbox className="w-10 h-10 text-slate-400 mb-3" />
    <p className="text-sm font-semibold text-slate-700">{message}</p>
    <p className="text-xs text-slate-400 mt-1">Please refine your spatial filters or query selection.</p>
  </div>
);

export const ErrorState: React.FC<StateProps> = ({ message = 'An error occurred while loading spatial features.', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 rounded border border-red-200 text-center">
    <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
    <p className="text-sm font-bold text-red-900">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-1.5 bg-[#1E3A8A] text-white font-semibold text-xs rounded hover:bg-[#0B192C] transition-colors"
      >
        Retry Request
      </button>
    )}
  </div>
);
