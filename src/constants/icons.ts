/**
 * ONE icon library for the whole project: lucide-react-native (rule #21).
 * Every icon is an SVG on a fixed square canvas — perfectly centered, so a row
 * of icons never drifts the way AI PNG sprites do.
 *
 * Everything funnels through this map so a single missing export can never
 * render `undefined` as a React element.
 */

import type { ComponentType } from 'react';
import {
  Aperture,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Cloud,
  CloudSun,
  Gauge,
  Hand,
  Home,
  LayoutGrid,
  Lightbulb,
  Lock,
  Moon,
  RotateCcw,
  Ruler,
  Settings,
  Sparkles,
  Sun,
  Sunset,
  Timer,
  TriangleAlert,
  Vibrate,
  Wind,
  X,
  Zap,
} from 'lucide-react-native';

export type LucideIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const Fallback = Circle as LucideIcon;

const safe = (C: unknown): LucideIcon =>
  (C as LucideIcon) || Fallback;

export const Icons = {
  aperture: safe(Aperture),
  back: safe(ArrowLeft),
  camera: safe(Camera),
  check: safe(Check),
  checkCircle: safe(CheckCircle) || safe(Check),
  clock: safe(Clock),
  cloud: safe(Cloud),
  cloudSun: safe(CloudSun),
  gauge: safe(Gauge),
  grid: safe(LayoutGrid),
  hand: safe(Hand),
  home: safe(Home),
  bulb: safe(Lightbulb),
  lock: safe(Lock),
  moon: safe(Moon),
  motion: safe(Wind),
  redo: safe(RotateCcw),
  ruler: safe(Ruler),
  settings: safe(Settings),
  stars: safe(Sparkles),
  sun: safe(Sun),
  sunset: safe(Sunset),
  timer: safe(Timer),
  warning: safe(TriangleAlert) || safe(Zap),
  vibrate: safe(Vibrate),
  close: safe(X),
  bolt: safe(Zap),
  dot: Fallback,
};

export type IconKey = keyof typeof Icons;

export function icon(key: string): LucideIcon {
  const found = (Icons as Record<string, LucideIcon>)[key];
  return found || Fallback;
}

export default Icons;
