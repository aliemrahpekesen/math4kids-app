import { create } from 'zustand';

interface UiToast {
  id: number;
  message: string;
  variant: 'info' | 'success' | 'warning';
}

interface UiStore {
  toasts: UiToast[];
  installPromptDismissed: boolean;
  toast: (message: string, variant?: UiToast['variant']) => void;
  dismissToast: (id: number) => void;
  dismissInstallPrompt: () => void;
}

let nextId = 1;

export const useUiStore = create<UiStore>((set) => ({
  toasts: [],
  installPromptDismissed: false,

  toast: (message, variant = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: nextId++, message, variant }],
    })),

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  dismissInstallPrompt: () => set({ installPromptDismissed: true }),
}));
