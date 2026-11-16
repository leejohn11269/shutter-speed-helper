import { Dimensions } from 'react-native';

/* ------------------------------------------------------------------ */
/* Geometry (rules #4 / #5 — children are derived from the frame)      */
/* ------------------------------------------------------------------ */

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

export const HEADER_PAD_TOP = 44;
export const HEADER_CONTENT_H = 72;
export const HEADER_H = HEADER_PAD_TOP + HEADER_CONTENT_H;

export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CARD_PAD = 14;
export const CARD_BORDER = 1;
export const BOARD_FRAME = CARD_PAD + CARD_BORDER; // 15

export const TILE_GAP = 10;
export const SCENE_COLS = 2;
export const SCENE_TILE_W = Math.floor(
  (BOARD_MAX_W - TILE_GAP * (SCENE_COLS - 1)) / SCENE_COLS,
);
export const SCENE_GRID_W =
  SCENE_TILE_W * SCENE_COLS + TILE_GAP * (SCENE_COLS - 1);
export const SCENE_ROWS = 4;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/** Vertical budget of the Menu grid: screen - header - 2 hints - chips - CTA block. */
const MENU_GRID_H = SCREEN_H - HEADER_H - 88 - 50 - 96;
export const SCENE_TILE_H = clamp(
  Math.floor((MENU_GRID_H - TILE_GAP * (SCENE_ROWS - 1)) / SCENE_ROWS),
  62,
  104,
);

/** Vertical budget of the dark dial module on GameScreen. */
export const DIAL_ROW_H = 58;
export const STAT_STRIP_H = 56;
const GAME_CONTROLS_H = 46 + 10 + 60 + 10 + 48 + 18;
const GAME_CARD_H =
  SCREEN_H - HEADER_H - (STAT_STRIP_H + 10) - GAME_CONTROLS_H - 28;
export const TRI_BOX = clamp(
  Math.min(
    BOARD_MAX_W - 2 * BOARD_FRAME,
    GAME_CARD_H - (DIAL_ROW_H * 3 + TILE_GAP * 2) - 2 * CARD_PAD - 16,
  ),
  132,
  260,
);

/* ------------------------------------------------------------------ */
/* Timing                                                              */
/* ------------------------------------------------------------------ */

export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;
export const PULSE_MS = 160;
export const LOCK_HOLD_MS = 420;
export const SCREEN_FADE_MS = 200;

/* ------------------------------------------------------------------ */
/* Exposure ladders — real camera rungs, per stop increment            */
/* ------------------------------------------------------------------ */

export type StopIncrement = 1 | 2 | 3; // 1 stop, 1/2 stop, 1/3 stop

export const APERTURES_FULL = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const APERTURES_HALF = [
  1.4, 1.7, 2, 2.4, 2.8, 3.3, 4, 4.8, 5.6, 6.7, 8, 9.5, 11, 13, 16, 19, 22,
];
export const APERTURES_THIRD = [
  1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10,
  11, 13, 14, 16, 18, 20, 22,
];

export const SHUTTERS_FULL = [
  1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30,
  1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2,
];
export const SHUTTERS_HALF = [
  1 / 4000, 1 / 3000, 1 / 2000, 1 / 1500, 1 / 1000, 1 / 750, 1 / 500, 1 / 350,
  1 / 250, 1 / 180, 1 / 125, 1 / 90, 1 / 60, 1 / 45, 1 / 30, 1 / 20, 1 / 15,
  1 / 10, 1 / 8, 1 / 6, 1 / 4, 1 / 3, 1 / 2, 0.7, 1, 1.5, 2,
];
export const SHUTTERS_THIRD = [
  1 / 4000, 1 / 3200, 1 / 2500, 1 / 2000, 1 / 1600, 1 / 1250, 1 / 1000, 1 / 800,
  1 / 640, 1 / 500, 1 / 400, 1 / 320, 1 / 250, 1 / 200, 1 / 160, 1 / 125,
  1 / 100, 1 / 80, 1 / 60, 1 / 50, 1 / 40, 1 / 30, 1 / 25, 1 / 20, 1 / 15,
  1 / 13, 1 / 10, 1 / 8, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 0.4, 1 / 2, 0.6, 0.8, 1,
  1.3, 1.6, 2,
];

export const ISOS_FULL = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
export const ISOS_HALF = [
  100, 140, 200, 280, 400, 560, 800, 1100, 1600, 2200, 3200, 4500, 6400, 9000,
  12800,
];
export const ISOS_THIRD = [
  100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000,
  2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800,
];

export type Ladders = {
  apertures: number[];
  shutters: number[];
  isos: number[];
};

export function ladders(increment: StopIncrement): Ladders {
  if (increment === 1) {
    return {
      apertures: APERTURES_FULL,
      shutters: SHUTTERS_FULL,
      isos: ISOS_FULL,
    };
  }
  if (increment === 2) {
    return {
      apertures: APERTURES_HALF,
      shutters: SHUTTERS_HALF,
      isos: ISOS_HALF,
    };
  }
  return {
    apertures: APERTURES_THIRD,
    shutters: SHUTTERS_THIRD,
    isos: ISOS_THIRD,
  };
}

export const STOP_OPTIONS: { value: StopIncrement; label: string }[] = [
  { value: 1, label: '1 STOP' },
  { value: 2, label: '1/2' },
  { value: 3, label: '1/3' },
];

export const FOCAL_LENGTHS = [24, 35, 50, 85, 135, 200];
export const DEFAULT_FOCAL = 50;
export const DEFAULT_SHUTTER = 1 / 125;
export const DEFAULT_APERTURE = 5.6;

/* ------------------------------------------------------------------ */
/* Scene presets — they fill the Menu bento grid                       */
/* ------------------------------------------------------------------ */

export type SceneIconKey =
  | 'sun'
  | 'cloudSun'
  | 'cloud'
  | 'moon'
  | 'sunset'
  | 'home'
  | 'bulb'
  | 'stars';

export type Scene = {
  id: string;
  name: string;
  targetEV: number;
  preferredISO: number;
  color: string;
  icon: SceneIconKey;
};

export const SCENES: Scene[] = [
  {
    id: 'sun',
    name: 'BRIGHT SUN',
    targetEV: 15,
    preferredISO: 100,
    color: '#E0902A',
    icon: 'sun',
  },
  {
    id: 'cloud_light',
    name: 'LIGHT CLOUD',
    targetEV: 13,
    preferredISO: 100,
    color: '#2A85AB',
    icon: 'cloudSun',
  },
  {
    id: 'overcast',
    name: 'OVERCAST',
    targetEV: 12,
    preferredISO: 200,
    color: '#2A85AB',
    icon: 'cloud',
  },
  {
    id: 'shade',
    name: 'OPEN SHADE',
    targetEV: 11,
    preferredISO: 400,
    color: '#7E8BB5',
    icon: 'moon',
  },
  {
    id: 'golden',
    name: 'GOLDEN HOUR',
    targetEV: 10,
    preferredISO: 400,
    color: '#E0902A',
    icon: 'sunset',
  },
  {
    id: 'window',
    name: 'WINDOW LIGHT',
    targetEV: 9,
    preferredISO: 800,
    color: '#2A85AB',
    icon: 'home',
  },
  {
    id: 'indoor',
    name: 'INDOOR WARM',
    targetEV: 7,
    preferredISO: 1600,
    color: '#E028AE',
    icon: 'bulb',
  },
  {
    id: 'night',
    name: 'NIGHT STREET',
    targetEV: 4,
    preferredISO: 3200,
    color: '#182124',
    icon: 'stars',
  },
];

export const DEFAULT_SCENE_ID = 'overcast';

export function sceneById(id: string): Scene {
  for (let i = 0; i < SCENES.length; i++) {
    if (SCENES[i].id === id) {
      return SCENES[i];
    }
  }
  return SCENES[2];
}

/* ------------------------------------------------------------------ */
/* Dials                                                               */
/* ------------------------------------------------------------------ */

export type DialKind = 'aperture' | 'shutter' | 'iso';

export const DIAL_ORDER: DialKind[] = ['aperture', 'shutter', 'iso'];

export const DIAL_COLORS: Record<DialKind, string> = {
  aperture: '#2A85AB',
  shutter: '#E028AE',
  iso: '#E0902A',
};

export const DIAL_LABELS: Record<DialKind, string> = {
  aperture: 'APERTURE',
  shutter: 'SHUTTER',
  iso: 'ISO',
};

export const LOCK_OPTIONS: { kind: DialKind; label: string }[] = [
  { kind: 'aperture', label: 'LOCK APERTURE' },
  { kind: 'shutter', label: 'LOCK SHUTTER' },
  { kind: 'iso', label: 'LOCK ISO' },
];

export const DEFAULT_LOCK: DialKind = 'shutter';

/* ------------------------------------------------------------------ */
/* Cheat cards (quick reference screen)                                */
/* ------------------------------------------------------------------ */

export type CheatIconKey =
  | 'sun'
  | 'hand'
  | 'aperture'
  | 'timer'
  | 'gauge'
  | 'motion';

export type CheatCardData = {
  id: string;
  title: string;
  body: string;
  pills: string[];
  footnote: string;
  icon: CheatIconKey;
};

export const CHEAT_CARDS: CheatCardData[] = [
  {
    id: 'sunny16',
    title: 'SUNNY 16 RULE',
    body: 'f/16 · shutter 1/ISO',
    pills: ['f/16', '1/100', 'ISO 100'],
    footnote: 'Bright sun, no meter needed.',
    icon: 'sun',
  },
  {
    id: 'reciprocity',
    title: 'RECIPROCITY · HANDHELD',
    body: 'slowest safe shutter = 1 / focal',
    pills: ['24mm 1/25', '50mm 1/50', '200mm 1/200'],
    footnote: 'Slower than this and shake shows up.',
    icon: 'hand',
  },
  {
    id: 'apertures',
    title: 'APERTURE LADDER',
    body: 'every rung halves the light',
    pills: ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16', '22'],
    footnote: 'Wide open means a thin focus plane.',
    icon: 'aperture',
  },
  {
    id: 'shutters',
    title: 'SHUTTER LADDER',
    body: 'seconds of open curtain',
    pills: ['1/4000', '1/500', '1/125', '1/60', '1/15', '1/4', '1s'],
    footnote: 'Each step doubles the exposure time.',
    icon: 'timer',
  },
  {
    id: 'isos',
    title: 'ISO LADDER',
    body: 'sensor gain · grain cost',
    pills: ['100', '200', '400', '800', '1600', '3200', '6400'],
    footnote: 'Above ISO 1600 expect visible grain.',
    icon: 'gauge',
  },
  {
    id: 'motion',
    title: 'MOTION GUIDE',
    body: 'freeze the subject you shoot',
    pills: ['walk 1/125', 'kids 1/250', 'sport 1/500', 'birds 1/1000'],
    footnote: 'Panning? Go one rung slower on purpose.',
    icon: 'motion',
  },
];

/* ------------------------------------------------------------------ */
/* Thresholds                                                          */
/* ------------------------------------------------------------------ */

export const DRIFT_CAUTION = 0.34;
export const DRIFT_PROBLEM = 1.0;
export const MOTION_SHUTTER = 1 / 125;
export const NOISE_CAUTION_ISO = 1600;
export const NOISE_PROBLEM_ISO = 6400;
export const EQUIVALENT_ROWS = 9;
