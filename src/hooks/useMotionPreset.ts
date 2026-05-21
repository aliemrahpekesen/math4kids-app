import { useEffect, useState } from 'react';

/**
 * Reduced-motion-aware animation gate. Returns `true` when animations
 * should play, `false` when the user prefers reduced motion. Components
 * use this to either skip Framer Motion props entirely or pass duration: 0.
 */
export function useMotionPreset(): boolean {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return enabled;
}
