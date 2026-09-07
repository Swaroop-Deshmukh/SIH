import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactElement;
  path: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, path }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && path !== '/' && path !== '/exploration' && path !== '/contact') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(path)) {
    return <AccessDenied requiredPath={path} />;
  }

  return children;
};
