import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Splash } from '../screens/Splash';
import { Placeholder } from '../screens/Placeholder';
import { ParentGate } from './ParentGate';
import { LessonSession } from './LessonSession';

/**
 * Route table per plan.md §3.2. Screens are placeholders for routes
 * implemented in later phases (P4 onboarding, P5 lesson flow, P8 parent).
 */
export const router = createBrowserRouter([
  { path: '/', element: <Splash /> },

  // Onboarding — implemented in P4 (T-020).
  {
    path: '/onboarding/language',
    element: <Placeholder title="Dil seç" homeLink={false} />,
  },
  {
    path: '/onboarding/profile',
    element: <Placeholder title="Profil oluştur" homeLink={false} />,
  },
  {
    path: '/onboarding/avatar',
    element: <Placeholder title="Karakter seç" homeLink={false} />,
  },
  {
    path: '/onboarding/theme',
    element: <Placeholder title="Tema seç" homeLink={false} />,
  },
  {
    path: '/onboarding/parent-email',
    element: (
      <Placeholder title="Ebeveyn e-postası (opsiyonel)" homeLink={false} />
    ),
  },

  // Profile picker
  {
    path: '/profile-picker',
    element: <Placeholder title="Profil seç" homeLink={false} />,
  },

  // Map + lesson flow — implemented in P5+.
  { path: '/map', element: <Placeholder title="Harita" homeLink={false} /> },

  {
    path: '/lesson/:id',
    element: <LessonSession />,
    children: [
      { index: true, element: <Placeholder title="Ders girişi" /> },
      { path: 'practice', element: <Placeholder title="Pratik" /> },
      { path: 'quiz', element: <Placeholder title="Test" /> },
      { path: 'result', element: <Placeholder title="Sonuç" /> },
    ],
  },

  { path: '/rewards', element: <Placeholder title="Ödüller" /> },
  { path: '/leaderboard', element: <Placeholder title="Sıralama" /> },

  // Parent area — gated.
  {
    path: '/parent/gate',
    element: <Placeholder title="Ebeveyn kapısı" homeLink />,
  },
  {
    path: '/parent',
    element: <ParentGate />,
    children: [
      { index: true, element: <Navigate to="/parent/dashboard" replace /> },
      { path: 'dashboard', element: <Placeholder title="Ebeveyn Paneli" /> },
      { path: 'reports/:cadence', element: <Placeholder title="Rapor" /> },
      { path: 'settings', element: <Placeholder title="Ayarlar" /> },
      { path: 'profiles', element: <Placeholder title="Profil yönetimi" /> },
      {
        path: 'email-preview',
        element: <Placeholder title="E-posta önizleme" />,
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);
