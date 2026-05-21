import { ThemeProvider, useTheme } from './themes/ThemeProvider';

function Inner() {
  const { tokens } = useTheme();
  return (
    <main className="app-shell">
      <h1 className="text-4xl font-display text-primary-fg drop-shadow">
        Math4Kids
      </h1>
      <p className="text-fg/80 mt-2">v0.1.0 — skeleton</p>
      <p className="text-muted mt-4 text-sm">Theme: {tokens.name.tr}</p>
    </main>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  );
}
