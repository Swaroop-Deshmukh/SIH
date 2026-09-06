import React from 'react';
import { Loader2, AlertTriangle, Database } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  height?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading spatial analytics...', 
  height = 'h-64' 
}) => {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center bg-brand-surface/40 border border-brand-border/60 rounded-xl p-6 text-center`}>
      <Loader2 className="w-8 h-8 text-brand-accent animate-spin mb-3" />
      <p className="text-xs font-semibold text-slate-200 tracking-wide">{message}</p>
      <p className="text-[11px] text-slate-500 mt-1">Connecting to PostGIS & Geoprocessing microservices</p>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  height?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no active spatial layers or operational records matching the selected filters.',
  actionText,
  onAction,
  height = 'h-64'
}) => {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center bg-brand-surface/30 border border-brand-border/60 rounded-xl p-6 text-center`}>
      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
        <Database className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3 py-1.5 bg-brand-accent text-brand-dark rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
  height?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Geoprocessing Service Exception',
  error = 'Failed to load telemetry or spatial dataset from PostGIS service.',
  onRetry,
  height = 'h-64'
}) => {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center bg-red-500/5 border border-red-500/30 rounded-xl p-6 text-center`}>
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-red-400">{title}</h4>
      <p className="text-xs text-slate-300 max-w-md mt-1">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-semibold transition-colors"
        >
          Retry Request
        </button>
      )}
    </div>
  );
};
