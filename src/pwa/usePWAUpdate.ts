import { useEffect, useRef, useState } from 'react';

interface PWAUpdateState {
  needRefresh: boolean;
  update: () => Promise<void>;
}

/**
 * Subscribe to PWA update events. Lazy-imports `virtual:pwa-register` so
 * tests (which don't run through Vite) can render the App without resolving
 * the virtual module.
 */
export function usePWAUpdate(): PWAUpdateState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    void (async () => {
      try {
        const mod = (await import(
          /* @vite-ignore */ 'virtual:pwa-register'
        )) as {
          registerSW: (opts: {
            immediate?: boolean;
            onNeedRefresh?: () => void;
            onRegisterError?: (err: unknown) => void;
          }) => (reload?: boolean) => Promise<void>;
        };
        if (cancelled) return;
        const updateSW = mod.registerSW({
          immediate: true,
          onNeedRefresh: () => {
            setNeedRefresh(true);
          },
          onRegisterError: (err) => {
            console.error('[pwa] register error', err);
          },
        });
        updateRef.current = async () => {
          await updateSW(true);
          window.location.reload();
        };
      } catch (err) {
        if (!cancelled) console.debug('[pwa] register skipped:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    needRefresh,
    update: async () => {
      if (updateRef.current) await updateRef.current();
    },
  };
}
