import { createContext, useContext, useMemo, type ReactNode } from 'react';

type Level = 'debug' | 'info' | 'warn' | 'error';

interface LoggerCtx {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const LoggerContext = createContext<LoggerCtx | null>(null);

const isProd = (): boolean => {
  // Vite's import.meta.env.PROD; jsdom tests get false.
  try {
    return import.meta.env.PROD;
  } catch {
    return false;
  }
};

const noop = (): void => {
  /* deliberately empty — production no-op for non-error logger sinks */
};

function makeLogger(): LoggerCtx {
  const prod = isProd();
  const sink: Record<Level, (...args: unknown[]) => void> = {
    debug: prod ? noop : console.debug.bind(console),
    info: prod ? noop : console.info.bind(console),
    warn: prod ? noop : console.warn.bind(console),
    error: console.error.bind(console),
  };
  return sink;
}

export function LoggerProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => makeLogger(), []);
  return (
    <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useLogger(): LoggerCtx {
  const ctx = useContext(LoggerContext);
  if (!ctx) throw new Error('useLogger must be used within <LoggerProvider>');
  return ctx;
}
