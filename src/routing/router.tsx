import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Splash } from '../screens/Splash';
import { Placeholder } from '../screens/Placeholder';
import { OnboardingLanguage } from '../screens/OnboardingLanguage';
import {
  OnboardingProfile,
  OnboardingAvatar,
} from '../screens/OnboardingProfile';
import { OnboardingTheme } from '../screens/OnboardingTheme';
import { OnboardingParentEmail } from '../screens/OnboardingParentEmail';
import { ProfilePicker } from '../screens/ProfilePicker';
import { Map } from '../screens/Map';
import { LessonIntro } from '../screens/LessonIntro';
import { LessonPractice } from '../screens/LessonPractice';
import { LessonQuiz } from '../screens/LessonQuiz';
import { LessonResult } from '../screens/LessonResult';
import { ParentGateScreen } from '../screens/ParentGateScreen';
import { ParentDashboard } from '../screens/ParentDashboard';
import { ParentReports } from '../screens/ParentReports';
import { ParentSettings } from '../screens/ParentSettings';
import { ParentProfiles } from '../screens/ParentProfiles';
import { ParentEmailPreview } from '../screens/ParentEmailPreview';
import { ParentGate } from './ParentGate';
import { LessonSession } from './LessonSession';

export const router = createBrowserRouter([
  { path: '/', element: <Splash /> },

  { path: '/onboarding/language', element: <OnboardingLanguage /> },
  { path: '/onboarding/profile', element: <OnboardingProfile /> },
  { path: '/onboarding/avatar', element: <OnboardingAvatar /> },
  { path: '/onboarding/theme', element: <OnboardingTheme /> },
  { path: '/onboarding/parent-email', element: <OnboardingParentEmail /> },

  { path: '/profile-picker', element: <ProfilePicker /> },

  { path: '/map', element: <Map /> },

  {
    path: '/lesson/:id',
    element: <LessonSession />,
    children: [
      { index: true, element: <LessonIntro /> },
      { path: 'practice', element: <LessonPractice /> },
      { path: 'quiz', element: <LessonQuiz /> },
      { path: 'result', element: <LessonResult /> },
    ],
  },

  { path: '/rewards', element: <Placeholder title="Ödüller" /> },
  { path: '/leaderboard', element: <Placeholder title="Sıralama" /> },

  { path: '/parent/gate', element: <ParentGateScreen /> },
  {
    path: '/parent',
    element: <ParentGate />,
    children: [
      { index: true, element: <Navigate to="/parent/dashboard" replace /> },
      { path: 'dashboard', element: <ParentDashboard /> },
      { path: 'reports/:cadence', element: <ParentReports /> },
      { path: 'settings', element: <ParentSettings /> },
      { path: 'profiles', element: <ParentProfiles /> },
      { path: 'email-preview', element: <ParentEmailPreview /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
