import { useCallback, useMemo, useRef, useState } from 'react';
import { DialKind, Ladders, Scene } from '../constants/config';
import {
  Triangle,
  canStep,
  ev100,
  freeDials,
  solveOpening,
  stepDial,
} from '../game/exposure';
import { Warning, buildWarnings, topWarning } from '../game/warnings';

export type ExposureApi = {
  triangle: Triangle;
  locked: DialKind;
  ev: number;
  stops: number;
  warnings: Warning[];
  banner: Warning | null;
  pulseKey: number;
  pulsedDial: DialKind | null;
  step: (kind: DialKind, dir: -1 | 1) => void;
  canStepDial: (kind: DialKind, dir: -1 | 1) => boolean;
  setLocked: (kind: DialKind) => void;
  apply: (next: Triangle) => void;
};

/**
 * Triangle state for the GameScreen. The locked dial is held, the two free
 * dials re-solve against the scene target on every stepper press.
 */
export function useExposure(
  scene: Scene,
  initialLock: DialKind,
  L: Ladders,
  focal: number,
  shutterWarnings: boolean,
): ExposureApi {
  const [locked, setLockedState] = useState<DialKind>(initialLock);
  const [triangle, setTriangle] = useState<Triangle>(() =>
    solveOpening(scene, initialLock, L),
  );
  const [pulseKey, setPulseKey] = useState(0);
  const pulsedRef = useRef<DialKind | null>(null);

  const step = useCallback(
    (kind: DialKind, dir: -1 | 1) => {
      setTriangle(prev => {
        const next = stepDial(prev, kind, dir, locked, scene.targetEV, L);
        return next;
      });
      const compensator = freeDials(locked).filter(k => k !== kind)[0];
      pulsedRef.current = compensator || null;
      setPulseKey(k => k + 1);
    },
    [L, locked, scene.targetEV],
  );

  const setLocked = useCallback(
    (kind: DialKind) => {
      setLockedState(kind);
      setTriangle(solveOpening(scene, kind, L));
      pulsedRef.current = null;
      setPulseKey(k => k + 1);
    },
    [L, scene],
  );

  const apply = useCallback((next: Triangle) => {
    setTriangle(next);
    pulsedRef.current = null;
    setPulseKey(k => k + 1);
  }, []);

  const canStepDial = useCallback(
    (kind: DialKind, dir: -1 | 1) =>
      kind !== locked && canStep(triangle, kind, dir, L),
    [L, locked, triangle],
  );

  const ev = useMemo(() => ev100(triangle), [triangle]);
  const stops = useMemo(
    () => Math.round((ev - scene.targetEV) * 10) / 10,
    [ev, scene.targetEV],
  );
  const warnings = useMemo(
    () => buildWarnings(triangle, scene.targetEV, focal, shutterWarnings),
    [focal, scene.targetEV, shutterWarnings, triangle],
  );
  const banner = useMemo(() => topWarning(warnings), [warnings]);

  return {
    triangle,
    locked,
    ev,
    stops,
    warnings,
    banner,
    pulseKey,
    pulsedDial: pulsedRef.current,
    step,
    canStepDial,
    setLocked,
    apply,
  };
}

export default useExposure;
