import { Component, type ReactNode } from 'react';

interface State {
  err: Error | null;
}

interface Props {
  children: ReactNode;
  onError?: (err: Error) => void;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  override state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  override componentDidCatch(err: Error): void {
    this.props.onError?.(err);
    console.error('[GlobalErrorBoundary]', err);
  }

  override render(): ReactNode {
    if (this.state.err) {
      return (
        <main className="app-shell">
          <div className="bg-surface rounded-soft shadow-card p-8 max-w-md text-center">
            <div className="text-6xl mb-4" aria-hidden="true">
              🌟
            </div>
            <h1 className="font-display text-2xl text-primary-fg mb-2">
              Bir şey ters gitti
            </h1>
            <p className="text-fg/80 mb-6">Haritaya geri dönelim!</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ err: null });
                window.location.assign('/');
              }}
              className="min-w-touch min-h-touch px-6 py-2 rounded-soft bg-accent text-accent-fg font-display shadow-glow"
            >
              Haritaya dön
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
