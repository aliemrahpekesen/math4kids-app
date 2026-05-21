import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PlaceholderProps {
  title: string;
  children?: ReactNode;
  homeLink?: boolean;
}

export function Placeholder({
  title,
  children,
  homeLink = true,
}: PlaceholderProps) {
  return (
    <main className="app-shell">
      <h1 className="font-display text-3xl text-primary-fg">{title}</h1>
      {children}
      {homeLink && (
        <Link
          to="/map"
          className="mt-6 inline-block px-6 py-2 rounded-soft bg-accent text-accent-fg font-display"
        >
          Haritaya dön
        </Link>
      )}
    </main>
  );
}
