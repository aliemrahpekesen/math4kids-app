import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './themes/ThemeProvider';
import { LoggerProvider } from './providers/LoggerProvider';
import { GlobalErrorBoundary } from './providers/GlobalErrorBoundary';
import { I18nProvider } from './i18n/I18nProvider';
import { AudioProvider } from './audio/AudioProvider';
import { router } from './routing/router';

export function App() {
  return (
    <LoggerProvider>
      <I18nProvider>
        <ThemeProvider>
          <AudioProvider>
            <GlobalErrorBoundary>
              <RouterProvider router={router} />
            </GlobalErrorBoundary>
          </AudioProvider>
        </ThemeProvider>
      </I18nProvider>
    </LoggerProvider>
  );
}
