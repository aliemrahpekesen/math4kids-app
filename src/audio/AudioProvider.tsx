import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Howl, Howler } from 'howler';
import { useSettingsStore } from '../state/settingsStore';

/**
 * Audio engine per ADR-0008 (queued voice strategy).
 *
 * Priority queue: narration > sfx; music duckable when narration fires.
 * v1 narration uses browser SpeechSynthesis (zero audio files); v2 swaps
 * to pre-recorded MP3/OGG via the same speak(textOrKey, locale) API.
 *
 * Gesture gate: AudioContext stays locked until the first user gesture
 * unlocks it; flag lives in module scope so it survives provider remounts
 * and fires exactly once per tab load.
 */

let gestureGranted = false;

interface AudioCtx {
  speak: (text: string, locale?: 'tr' | 'en' | 'de') => void;
  stopSpeaking: () => void;
  play: (sfxKey: SfxKey) => void;
  setMusicEnabled: (on: boolean) => void;
}

type SfxKey = 'correct' | 'wrong' | 'reward' | 'tap';

const AudioContext = createContext<AudioCtx | null>(null);

interface QueueItem {
  text: string;
  locale: 'tr' | 'en' | 'de';
}

function granted(): boolean {
  return gestureGranted;
}

function unlock(): void {
  if (gestureGranted) return;
  gestureGranted = true;
  // Howler resumes its AudioContext on first interaction.
  try {
    void (
      Howler as unknown as { ctx?: { resume: () => Promise<void> } }
    ).ctx?.resume();
  } catch {
    /* ignore */
  }
}

const LOCALE_TO_VOICE: Record<'tr' | 'en' | 'de', string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
};

function makeBeep(freq: number, durationMs = 120): () => void {
  let howl: Howl | null = null;
  return () => {
    // Generate a short WAV data URI sine beep (no audio files needed in v1).
    const sampleRate = 44_100;
    const samples = Math.floor((durationMs / 1000) * sampleRate);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, samples * 2, true);
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-3 * t);
      const v = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
      view.setInt16(44 + i * 2, Math.round(v * 32767), true);
    }
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    howl ??= new Howl({ src: [url], format: ['wav'], html5: false });
    howl.play();
  };
}

const sfxPlayers: Record<SfxKey, () => void> = {
  correct: makeBeep(880, 150),
  wrong: makeBeep(220, 200),
  reward: makeBeep(1320, 220),
  tap: makeBeep(660, 60),
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioOn = useSettingsStore((s) => s.audioOn);
  const musicOn = useSettingsStore((s) => s.musicOn);
  const language = useSettingsStore((s) => s.language);
  const queue = useRef<QueueItem[]>([]);
  const speaking = useRef(false);

  // First-gesture listener — unlocks audio once per tab load.
  useEffect(() => {
    if (granted()) return;
    const onGesture = () => {
      unlock();
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      window.removeEventListener('click', onGesture, true);
      window.removeEventListener('touchstart', onGesture);
    };
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture);
    // Capture-phase click listener catches synthetic React clicks in tests.
    window.addEventListener('click', onGesture, true);
    window.addEventListener('touchstart', onGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      window.removeEventListener('click', onGesture, true);
      window.removeEventListener('touchstart', onGesture);
    };
  }, []);

  const drainQueue = (): void => {
    if (speaking.current) return;
    const next = queue.current.shift();
    if (!next) return;
    speaking.current = true;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      speaking.current = false;
      return;
    }
    const utter = new SpeechSynthesisUtterance(next.text);
    utter.lang = LOCALE_TO_VOICE[next.locale];
    utter.rate = 0.95;
    utter.onend = () => {
      speaking.current = false;
      drainQueue();
    };
    utter.onerror = () => {
      speaking.current = false;
      drainQueue();
    };
    window.speechSynthesis.speak(utter);
  };

  const value = useMemo<AudioCtx>(() => {
    return {
      speak: (text, locale) => {
        if (!audioOn || !granted()) return;
        queue.current.push({ text, locale: locale ?? language });
        drainQueue();
      },
      stopSpeaking: () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        queue.current = [];
        speaking.current = false;
      },
      play: (sfxKey) => {
        if (!audioOn || !granted()) return;
        sfxPlayers[sfxKey]();
      },
      setMusicEnabled: () => {
        // Music v1 placeholder: no background music files yet. The state flag
        // is honored when v2 wires actual music tracks.
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioOn, language]);

  // Music toggle reflection (no-op for now until v2 ships music files).
  useEffect(() => {
    void musicOn;
  }, [musicOn]);

  // Stop speech on unmount / audio toggle off.
  useEffect(() => {
    if (audioOn) return;
    value.stopSpeaking();
  }, [audioOn, value]);

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio(): AudioCtx {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within <AudioProvider>');
  return ctx;
}
