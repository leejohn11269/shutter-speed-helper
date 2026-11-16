/**
 * Warning engine — translates a triangle into plain-language problems.
 */

import {
  DRIFT_CAUTION,
  DRIFT_PROBLEM,
  MOTION_SHUTTER,
  NOISE_CAUTION_ISO,
  NOISE_PROBLEM_ISO,
} from '../constants/config';
import { Triangle, ev100, handheldLimit } from './exposure';
import { formatFocal, formatShutter, formatStops } from '../utils/format';

export type Severity = 'info' | 'caution' | 'problem';

export type Warning = {
  id: string;
  severity: Severity;
  text: string;
  tip: string;
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  info: '#2A85AB',
  caution: '#E0902A',
  problem: '#E028AE',
};

export function buildWarnings(
  t: Triangle,
  targetEV: number,
  focal: number,
  shutterWarnings: boolean,
): Warning[] {
  const list: Warning[] = [];
  const limit = handheldLimit(focal);
  const drift = ev100(t) - targetEV;

  if (shutterWarnings && t.shutter > limit * 2) {
    list.push({
      id: 'shake-severe',
      severity: 'problem',
      text:
        formatShutter(t.shutter) +
        ' · far below the handheld limit for ' +
        formatFocal(focal),
      tip:
        'Put the camera on something solid, or raise ISO until the shutter passes ' +
        formatShutter(limit) +
        '.',
    });
  } else if (shutterWarnings && t.shutter > limit * 1.05) {
    list.push({
      id: 'shake',
      severity: 'caution',
      text:
        formatShutter(t.shutter) +
        ' · below the handheld limit for ' +
        formatFocal(focal),
      tip:
        'Brace against a wall or open the aperture one rung to get back to ' +
        formatShutter(limit) +
        '.',
    });
  }

  if (t.shutter > MOTION_SHUTTER * 1.05) {
    list.push({
      id: 'motion',
      severity: 'caution',
      text: 'Moving subjects will smear below 1/125',
      tip: 'For walking people keep 1/125, for sport go to 1/500.',
    });
  }

  if (t.iso >= NOISE_PROBLEM_ISO) {
    list.push({
      id: 'noise-high',
      severity: 'problem',
      text: 'ISO ' + Math.round(t.iso) + ' · heavy grain in the shadows',
      tip: 'Drop ISO two rungs and accept a slower shutter if you can brace.',
    });
  } else if (t.iso >= NOISE_CAUTION_ISO) {
    list.push({
      id: 'noise',
      severity: 'caution',
      text: 'ISO ' + Math.round(t.iso) + ' · visible grain in the shadows',
      tip: 'Open the aperture one rung to buy a cleaner ISO.',
    });
  }

  if (t.aperture <= 2) {
    list.push({
      id: 'thin-dof',
      severity: 'info',
      text: 'Wide open · very thin plane of focus',
      tip: 'Great for portraits, risky for groups — stop down to f/4 for two faces.',
    });
  } else if (t.aperture >= 16) {
    list.push({
      id: 'diffraction',
      severity: 'info',
      text: 'f/16 and smaller · diffraction softens fine detail',
      tip: 'f/8 to f/11 is the sharpest part of most lenses.',
    });
  }

  if (Math.abs(drift) > DRIFT_PROBLEM) {
    list.push({
      id: 'drift-high',
      severity: 'problem',
      text: 'Exposure is ' + formatStops(drift) + ' off the scene target',
      tip: 'Both free dials hit the end of their ladder — change the locked value.',
    });
  } else if (Math.abs(drift) > DRIFT_CAUTION) {
    list.push({
      id: 'drift',
      severity: 'caution',
      text: 'Exposure is ' + formatStops(drift) + ' off the scene target',
      tip: 'Nudge ISO one rung to bring the triangle back on target.',
    });
  }

  return list;
}

export function topWarning(list: Warning[]): Warning | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i].severity === 'problem') {
      return list[i];
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].severity === 'caution') {
      return list[i];
    }
  }
  return list.length > 0 ? list[0] : null;
}

export function hasWarning(list: Warning[], id: string): boolean {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return true;
    }
  }
  return false;
}
