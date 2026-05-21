import { create } from 'zustand';
import type { Language } from './types';
import type { ThemeKey } from '../themes/types';

interface SettingsStore {
  language: Language;
  theme: ThemeKey;
  audioOn: boolean;
  musicOn: boolean;
  narrationRepeatOn: boolean;
  leaderboardVisible: boolean;
  parentPinSet: boolean;
  parentEmail: string;
  setLanguage: (l: Language) => void;
  setTheme: (t: ThemeKey) => void;
  setAudio: (on: boolean) => void;
  setMusic: (on: boolean) => void;
  setNarrationRepeat: (on: boolean) => void;
  setLeaderboardVisible: (on: boolean) => void;
  setParentPinSet: (on: boolean) => void;
  setParentEmail: (email: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  language: 'tr',
  theme: 'space',
  audioOn: true,
  musicOn: true,
  narrationRepeatOn: true,
  leaderboardVisible: true,
  parentPinSet: false,
  parentEmail: '',

  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setAudio: (audioOn) => set({ audioOn }),
  setMusic: (musicOn) => set({ musicOn }),
  setNarrationRepeat: (narrationRepeatOn) => set({ narrationRepeatOn }),
  setLeaderboardVisible: (leaderboardVisible) => set({ leaderboardVisible }),
  setParentPinSet: (parentPinSet) => set({ parentPinSet }),
  setParentEmail: (parentEmail) => set({ parentEmail }),
}));
