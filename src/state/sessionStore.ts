import { create } from 'zustand';

interface SessionStore {
  parentGateAuthorized: boolean;
  authorizeParentGate: () => void;
  revokeParentGate: () => void;

  // Lesson session state — populated by LessonSession outlet.
  lessonExerciseIndex: number;
  lessonHintsUsed: number;
  lessonStartedAt: number | null;
  lessonAnswers: { correct: boolean }[];
  resetLessonSession: () => void;
  incrementExercise: () => void;
  incrementHint: () => void;
  recordAnswer: (correct: boolean) => void;
  startLesson: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  parentGateAuthorized: false,
  authorizeParentGate: () => set({ parentGateAuthorized: true }),
  revokeParentGate: () => set({ parentGateAuthorized: false }),

  lessonExerciseIndex: 0,
  lessonHintsUsed: 0,
  lessonStartedAt: null,
  lessonAnswers: [],
  resetLessonSession: () =>
    set({
      lessonExerciseIndex: 0,
      lessonHintsUsed: 0,
      lessonStartedAt: null,
      lessonAnswers: [],
    }),
  incrementExercise: () =>
    set((state) => ({ lessonExerciseIndex: state.lessonExerciseIndex + 1 })),
  incrementHint: () =>
    set((state) => ({ lessonHintsUsed: state.lessonHintsUsed + 1 })),
  recordAnswer: (correct) =>
    set((state) => ({
      lessonAnswers: [...state.lessonAnswers, { correct }],
    })),
  startLesson: () => set({ lessonStartedAt: Date.now() }),
}));
