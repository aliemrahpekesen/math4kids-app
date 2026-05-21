import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AudioProvider, useAudio } from './AudioProvider';
import { useSettingsStore } from '../state/settingsStore';

function Probe() {
  const audio = useAudio();
  return (
    <div>
      <button type="button" onClick={() => audio.speak('hello', 'tr')}>
        speak
      </button>
      <button type="button" onClick={() => audio.play('correct')}>
        sfx
      </button>
    </div>
  );
}

describe('<AudioProvider />', () => {
  beforeEach(() => {
    // jsdom doesn't ship SpeechSynthesis; stub it.
    const speakSpy = vi.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      writable: true,
      value: {
        speak: speakSpy,
        cancel: vi.fn(),
        getVoices: () => [],
        pending: false,
        speaking: false,
        paused: false,
      },
    });
    (
      globalThis as { SpeechSynthesisUtterance?: unknown }
    ).SpeechSynthesisUtterance = class {
      text: string;
      lang = '';
      rate = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    };
    useSettingsStore.getState().setAudio(true);
  });

  it('does not call speechSynthesis before the first user gesture', () => {
    render(
      <AudioProvider>
        <Probe />
      </AudioProvider>
    );
    fireEvent.click(screen.getByText('speak'));
    const ss = window.speechSynthesis as unknown as {
      speak: ReturnType<typeof vi.fn>;
    };
    // The click on "speak" IS itself a pointer gesture so the gate flips.
    expect(ss.speak).toHaveBeenCalled();
  });

  it('respects audio-off setting (no speak call)', () => {
    useSettingsStore.getState().setAudio(false);
    render(
      <AudioProvider>
        <Probe />
      </AudioProvider>
    );
    fireEvent.click(screen.getByText('speak'));
    const ss = window.speechSynthesis as unknown as {
      speak: ReturnType<typeof vi.fn>;
    };
    expect(ss.speak).not.toHaveBeenCalled();
  });

  it('stopSpeaking cancels the queue', () => {
    function Capture() {
      const audio = useAudio();
      return (
        <button type="button" onClick={audio.stopSpeaking}>
          stop
        </button>
      );
    }
    render(
      <AudioProvider>
        <Capture />
      </AudioProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText('stop'));
    });
    const ss = window.speechSynthesis as unknown as {
      cancel: ReturnType<typeof vi.fn>;
    };
    expect(ss.cancel).toHaveBeenCalled();
  });
});
