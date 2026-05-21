// Test stub for the `virtual:pwa-register` virtual module emitted by
// vite-plugin-pwa. Vitest can't see the Vite plugin, so we alias it to
// this no-op in vitest.config.ts.

export function registerSW(_opts: {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onRegisterError?: (err: unknown) => void;
}) {
  void _opts;
  return async (_reload?: boolean): Promise<void> => {
    void _reload;
    return Promise.resolve();
  };
}
