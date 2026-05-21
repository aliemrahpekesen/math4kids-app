import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { runMigrations } from './persistence/migrate';
import { hydrateFromRepos } from './state/profileActions';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

async function boot(): Promise<void> {
  try {
    await runMigrations();
    await hydrateFromRepos();
  } catch (err) {
    // MigrationError surfaces through the error boundary; other errors
    // logged but render proceeds.
    console.error('[boot]', err);
  }
}

void boot().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
