import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_THEME, getTheme } from './registry';
import { tokensToCSSVars, type ThemeKey, type ThemeTokens } from './types';

interface ThemeContextValue {
  key: ThemeKey;
  tokens: ThemeTokens;
  setTheme: (next: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initial?: ThemeKey;
  children: ReactNode;
}

function applyVarsToRoot(vars: Record<string, string>): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
}

export function ThemeProvider({
  initial = DEFAULT_THEME,
  children,
}: ThemeProviderProps): JSX.Element {
  const [key, setKey] = useState<ThemeKey>(initial);

  const tokens = useMemo<ThemeTokens>(() => {
    const t = getTheme(key);
    if (!t) {
      // Fallback to default if a not-yet-loaded theme is requested synchronously.
      const fallback = getTheme(DEFAULT_THEME);
      if (!fallback) {
        throw new Error('Default theme failed to load — registry is empty.');
      }
      return fallback;
    }
    return t;
  }, [key]);

  useEffect(() => {
    applyVarsToRoot(tokensToCSSVars(tokens));
  }, [tokens]);

  const value = useMemo<ThemeContextValue>(
    () => ({ key, tokens, setTheme: setKey }),
    [key, tokens]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider is intentional
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>');
  }
  return ctx;
}
