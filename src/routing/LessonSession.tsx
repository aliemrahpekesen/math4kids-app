import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useSessionStore } from '../state/sessionStore';

/**
 * Holds session-scoped state (exercise index, hint count, elapsed time).
 * Resets on entering /lesson/:id. Rejects deep links into mid-flow
 * routes (.../practice|quiz|result) when no session is active.
 */
export function LessonSession() {
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const startedAt = useSessionStore((s) => s.lessonStartedAt);
  const startLesson = useSessionStore((s) => s.startLesson);
  const reset = useSessionStore((s) => s.resetLessonSession);

  useEffect(() => {
    reset();
    startLesson();
  }, [params.id, reset, startLesson]);

  // Deep-link guard: if someone navigates to /lesson/X/quiz from outside
  // without entering /lesson/X first, redirect to the intro.
  const isMidFlow = /\/(practice|quiz|result)$/.test(location.pathname);
  if (isMidFlow && !startedAt) {
    return <Navigate to={`/lesson/${params.id ?? '1'}`} replace />;
  }

  return <Outlet />;
}
