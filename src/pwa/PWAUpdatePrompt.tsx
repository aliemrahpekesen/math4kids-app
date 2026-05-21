import { usePWAUpdate } from './usePWAUpdate';

export function PWAUpdatePrompt() {
  const { needRefresh, update } = usePWAUpdate();
  if (!needRefresh) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-surface text-fg rounded-soft shadow-card px-5 py-3 font-display flex items-center gap-3"
    >
      <span>🆕 Yeni sürüm var</span>
      <button
        type="button"
        onClick={() => void update()}
        className="px-3 py-1 rounded-soft bg-accent text-accent-fg min-h-touch"
      >
        Yenile
      </button>
    </div>
  );
}
