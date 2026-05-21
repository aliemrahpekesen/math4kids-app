import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './themes/ThemeProvider';
import { LoggerProvider } from './providers/LoggerProvider';
import { GlobalErrorBoundary } from './providers/GlobalErrorBoundary';
import { router } from './routing/router';

export function App() {
  return (
    <LoggerProvider>
      <ThemeProvider>
        <GlobalErrorBoundary>
          <RouterProvider router={router} />
        </GlobalErrorBoundary>
      </ThemeProvider>
    </LoggerProvider>
  );
}
