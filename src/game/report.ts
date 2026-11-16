/**
 * Round result — what the ResultScreen shows after LOCK EXPOSURE.
 */

import { DRIFT_CAUTION, DRIFT_PROBLEM } from '../constants/config';
import { Triangle, ev100 } from './exposure';
import { Warning, buildWarnings, hasWarning } from './warnings';

export type Grade = 'WELL EXPOSED' | 'SLIGHTLY OFF' | 'RISKY SHOT';

export type Report = {
  triangle: Triangle;
  sceneId: string;
  sceneName: string;
  targetEV: number;
  ev: number;
  stops: number;
  sharpness: number;
  noiseLabel: 'LOW' | 'MED' | 'HIGH';
  grade: Grade;
  gradeColor: string;
  warnings: Warning[];
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const GRADE_COLORS: Record<Grade, string> = {
  'WELL EXPOSED': '#2BA06B',
  'SLIGHTLY OFF': '#E0902A',
  'RISKY SHOT': '#E028AE',
};

export function buildReport(
  triangle: Triangle,
  sceneId: string,
  sceneName: string,
  targetEV: number,
  focal: number,
  shutterWarnings: boolean,
): Report {
  const warnings = buildWarnings(triangle, targetEV, focal, shutterWarnings);
  const ev = ev100(triangle);
  const stops = Math.round((ev - targetEV) * 10) / 10;

  const severeShake = hasWarning(warnings, 'shake-severe') ? 1 : 0;
  const shake = hasWarning(warnings, 'shake') ? 1 : 0;
  const motion = hasWarning(warnings, 'motion') ? 1 : 0;
  const sharpness = Math.round(
    clamp(100 - 28 * severeShake - 14 * shake - 10 * motion, 0, 100),
  );

  const noiseLabel: Report['noiseLabel'] =
    triangle.iso <= 400 ? 'LOW' : triangle.iso <= 1600 ? 'MED' : 'HIGH';

  const absStops = Math.abs(stops);
  const grade: Grade =
    absStops <= DRIFT_CAUTION && sharpness >= 85
      ? 'WELL EXPOSED'
      : absStops <= DRIFT_PROBLEM && sharpness >= 60
      ? 'SLIGHTLY OFF'
      : 'RISKY SHOT';

  return {
    triangle,
    sceneId,
    sceneName,
    targetEV,
    ev,
    stops,
    sharpness,
    noiseLabel,
    grade,
    gradeColor: GRADE_COLORS[grade],
    warnings,
  };
}

export type Tip = {
  id: string;
  text: string;
  color: string;
};

const TIP_COLORS: Record<string, string> = {
  info: '#2A85AB',
  caution: '#E0902A',
  problem: '#E028AE',
};

export function buildTips(report: Report): Tip[] {
  const tips: Tip[] = [];
  for (let i = 0; i < report.warnings.length && tips.length < 4; i++) {
    const w = report.warnings[i];
    tips.push({ id: w.id, text: w.tip, color: TIP_COLORS[w.severity] });
  }
  if (tips.length === 0) {
    tips.push({
      id: 'clean',
      text:
        'Clean triangle — this exposure matches ' +
        report.sceneName.toLowerCase() +
        ' with no shake or grain risk.',
      color: '#2BA06B',
    });
    tips.push({
      id: 'learn',
      text: 'Open SHOW EQUIVALENTS next time to see the same photo at other apertures.',
      color: '#2A85AB',
    });
  }
  return tips;
}
