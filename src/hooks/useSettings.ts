import { useCallback, useMemo, useState } from 'react';
import {
  DEFAULT_FOCAL,
  FOCAL_LENGTHS,
  StopIncrement,
  ladders,
} from '../constants/config';

export type ThemeMode = 'light' | 'graphite';

export type Settings = {
  increment: StopIncrement;
  focal: number;
  mode: ThemeMode;
  haptics: boolean;
  shutterWarnings: boolean;
};

export type SettingsApi = Settings & {
  ladders: ReturnType<typeof ladders>;
  setIncrement: (v: StopIncrement) => void;
  stepFocal: (dir: -1 | 1) => void;
  setMode: (v: ThemeMode) => void;
  toggleHaptics: () => void;
  toggleShutterWarnings: () => void;
};

/**
 * In-memory settings for this build (no AsyncStorage — only the three allowed
 * native deps are installed). Owned by App.tsx and passed down as props so no
 * screen subscribes to state it does not read (react-state-minimize).
 */
export function useSettings(): SettingsApi {
  const [increment, setIncrement] = useState<StopIncrement>(1);
  const [focal, setFocal] = useState<number>(DEFAULT_FOCAL);
  const [mode, setMode] = useState<ThemeMode>('light');
  const [haptics, setHaptics] = useState(true);
  const [shutterWarnings, setShutterWarnings] = useState(true);

  const stepFocal = useCallback((dir: -1 | 1) => {
    setFocal(prev => {
      const idx = FOCAL_LENGTHS.indexOf(prev);
      const next = (idx < 0 ? 2 : idx) + dir;
      if (next < 0 || next >= FOCAL_LENGTHS.length) {
        return prev;
      }
      return FOCAL_LENGTHS[next];
    });
  }, []);

  const toggleHaptics = useCallback(() => setHaptics(p => !p), []);
  const toggleShutterWarnings = useCallback(
    () => setShutterWarnings(p => !p),
    [],
  );

  const L = useMemo(() => ladders(increment), [increment]);

  return {
    increment,
    focal,
    mode,
    haptics,
    shutterWarnings,
    ladders: L,
    setIncrement,
    stepFocal,
    setMode,
    toggleHaptics,
    toggleShutterWarnings,
  };
}

export default useSettings;
