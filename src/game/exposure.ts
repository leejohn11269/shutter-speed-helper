/**
 * Exposure math — the aperture / shutter / ISO triangle.
 *
 *   EV100 = log2(N^2 / t) - log2(ISO / 100)
 *
 * Every solved value is snapped to a real rung of its ladder, so the UI only
 * ever shows numbers a camera actually has.
 */

import {
  DEFAULT_APERTURE,
  DEFAULT_SHUTTER,
  DialKind,
  EQUIVALENT_ROWS,
  Ladders,
  MOTION_SHUTTER,
  NOISE_CAUTION_ISO,
  Scene,
} from '../constants/config';

export type Triangle = {
  aperture: number;
  shutter: number;
  iso: number;
};

const log2 = (x: number) => Math.log(x) / Math.LN2;

export function ev100(t: Triangle): number {
  return log2((t.aperture * t.aperture) / t.shutter) - log2(t.iso / 100);
}

export function stopsOff(t: Triangle, targetEV: number): number {
  return Math.round((ev100(t) - targetEV) * 10) / 10;
}

export function solveShutter(N: number, iso: number, evT: number): number {
  return (N * N) / (Math.pow(2, evT) * (iso / 100));
}

export function solveAperture(t: number, iso: number, evT: number): number {
  return Math.sqrt(t * Math.pow(2, evT) * (iso / 100));
}

export function solveIso(N: number, t: number, evT: number): number {
  return (100 * (N * N)) / (t * Math.pow(2, evT));
}

/** Index of the ladder rung closest to `value` (log distance). */
export function nearestIndex(ladder: number[], value: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < ladder.length; i++) {
    const d = Math.abs(log2(ladder[i]) - log2(value));
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function snap(ladder: number[], value: number): number {
  if (!isFinite(value) || value <= 0) {
    return ladder[Math.floor(ladder.length / 2)];
  }
  return ladder[nearestIndex(ladder, value)];
}

export function ladderFor(kind: DialKind, L: Ladders): number[] {
  if (kind === 'aperture') {
    return L.apertures;
  }
  if (kind === 'shutter') {
    return L.shutters;
  }
  return L.isos;
}

export function valueOf(t: Triangle, kind: DialKind): number {
  if (kind === 'aperture') {
    return t.aperture;
  }
  if (kind === 'shutter') {
    return t.shutter;
  }
  return t.iso;
}

export function withValue(t: Triangle, kind: DialKind, value: number): Triangle {
  if (kind === 'aperture') {
    return { aperture: value, shutter: t.shutter, iso: t.iso };
  }
  if (kind === 'shutter') {
    return { aperture: t.aperture, shutter: value, iso: t.iso };
  }
  return { aperture: t.aperture, shutter: t.shutter, iso: value };
}

/** The two dials that are free to move when `locked` is held. */
export function freeDials(locked: DialKind): DialKind[] {
  const all: DialKind[] = ['aperture', 'shutter', 'iso'];
  return all.filter(k => k !== locked);
}

/**
 * Opening triangle for a scene: keep the locked dial at its sensible default,
 * then pick the pair of free rungs that lands closest to the target EV while
 * staying near the scene's preferred ISO and a hand-holdable shutter.
 */
export function solveOpening(
  scene: Scene,
  locked: DialKind,
  L: Ladders,
): Triangle {
  const lockedValue =
    locked === 'aperture'
      ? snap(L.apertures, DEFAULT_APERTURE)
      : locked === 'shutter'
      ? snap(L.shutters, DEFAULT_SHUTTER)
      : snap(L.isos, scene.preferredISO);

  const apertures = locked === 'aperture' ? [lockedValue] : L.apertures;
  const shutters = locked === 'shutter' ? [lockedValue] : L.shutters;
  const isos = locked === 'iso' ? [lockedValue] : L.isos;

  let best: Triangle = {
    aperture: apertures[0],
    shutter: shutters[0],
    iso: isos[0],
  };
  let bestCost = Infinity;

  for (let a = 0; a < apertures.length; a++) {
    for (let s = 0; s < shutters.length; s++) {
      for (let i = 0; i < isos.length; i++) {
        const cand: Triangle = {
          aperture: apertures[a],
          shutter: shutters[s],
          iso: isos[i],
        };
        const drift = Math.abs(ev100(cand) - scene.targetEV);
        if (drift > 2) {
          continue;
        }
        const isoPenalty = 0.45 * Math.abs(log2(cand.iso / scene.preferredISO));
        const shutterPenalty =
          0.3 * Math.abs(log2(cand.shutter / DEFAULT_SHUTTER));
        const aperturePenalty =
          0.2 * Math.abs(log2(cand.aperture / DEFAULT_APERTURE));
        const cost = drift * 6 + isoPenalty + shutterPenalty + aperturePenalty;
        if (cost < bestCost) {
          bestCost = cost;
          best = cand;
        }
      }
    }
  }

  return best;
}

/**
 * Move `kind` by one rung (dir = -1 | +1) and let the other free dial
 * compensate so the exposure stays on target. When the compensating dial runs
 * out of ladder the exposure is allowed to drift — the EV pill goes magenta.
 */
export function stepDial(
  current: Triangle,
  kind: DialKind,
  dir: -1 | 1,
  locked: DialKind,
  targetEV: number,
  L: Ladders,
): Triangle {
  if (kind === locked) {
    return current;
  }
  const ladder = ladderFor(kind, L);
  const idx = nearestIndex(ladder, valueOf(current, kind));
  const nextIdx = idx + dir;
  if (nextIdx < 0 || nextIdx >= ladder.length) {
    return current;
  }

  const moved = withValue(current, kind, ladder[nextIdx]);
  const compensator = freeDials(locked).filter(k => k !== kind)[0];
  if (!compensator) {
    return moved;
  }

  const compLadder = ladderFor(compensator, L);
  let raw: number;
  if (compensator === 'aperture') {
    raw = solveAperture(moved.shutter, moved.iso, targetEV);
  } else if (compensator === 'shutter') {
    raw = solveShutter(moved.aperture, moved.iso, targetEV);
  } else {
    raw = solveIso(moved.aperture, moved.shutter, targetEV);
  }

  const snapped = snap(compLadder, raw);
  return withValue(moved, compensator, snapped);
}

export function canStep(
  current: Triangle,
  kind: DialKind,
  dir: -1 | 1,
  L: Ladders,
): boolean {
  const ladder = ladderFor(kind, L);
  const idx = nearestIndex(ladder, valueOf(current, kind));
  const next = idx + dir;
  return next >= 0 && next < ladder.length;
}

export type EquivalentRow = {
  key: string;
  aperture: number;
  shutter: number;
  iso: number;
  tag: 'SHARP' | 'SHAKE' | 'GRAIN';
  current: boolean;
};

/**
 * Nine equal exposures around the current one: walk the aperture ladder and
 * solve the shutter so the EV never changes. Same photo brightness, different
 * physics.
 */
export function equivalents(
  current: Triangle,
  L: Ladders,
  focal: number,
): EquivalentRow[] {
  const ev = ev100(current);
  const centre = nearestIndex(L.apertures, current.aperture);
  const half = Math.floor(EQUIVALENT_ROWS / 2);
  let start = centre - half;
  start = Math.max(0, Math.min(start, L.apertures.length - EQUIVALENT_ROWS));
  start = Math.max(0, start);

  const rows: EquivalentRow[] = [];
  const count = Math.min(EQUIVALENT_ROWS, L.apertures.length);
  for (let i = 0; i < count; i++) {
    const aperture = L.apertures[start + i];
    const shutter = snap(L.shutters, solveShutter(aperture, current.iso, ev));
    const limit = 1 / focal;
    const tag: EquivalentRow['tag'] =
      shutter > limit * 1.05
        ? 'SHAKE'
        : current.iso >= NOISE_CAUTION_ISO
        ? 'GRAIN'
        : shutter > MOTION_SHUTTER * 1.05
        ? 'SHAKE'
        : 'SHARP';
    rows.push({
      key: 'eq-' + (start + i),
      aperture,
      shutter,
      iso: current.iso,
      tag,
      current: start + i === centre,
    });
  }
  return rows;
}

export function handheldLimit(focal: number): number {
  return 1 / focal;
}
