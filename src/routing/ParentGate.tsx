import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '../state/sessionStore';

/**
 * Wraps /parent/* routes. If the in-memory session token is not granted,
 * redirects to /parent/gate. The gate screen calls `authorizeParentGate()`
 * on correct PIN entry.
 */
export function ParentGate() {
  const authorized = useSessionStore((s) => s.parentGateAuthorized);
  const location = useLocation();
  if (!authorized && location.pathname !== '/parent/gate') {
    return <Navigate to="/parent/gate" replace />;
  }
  return <Outlet />;
}
