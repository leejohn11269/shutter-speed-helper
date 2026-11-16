/**
 * Number formatting for the dials and reports.
 * ASCII only — no arrow/chevron glyphs anywhere (rule #15).
 */

export function formatAperture(n: number): string {
  if (!isFinite(n)) {
    return 'f/--';
  }
  const rounded = Math.round(n * 10) / 10;
  return 'f/' + (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1));
}

export function formatShutter(t: number): string {
  if (!isFinite(t) || t <= 0) {
    return '--';
  }
  if (t >= 1) {
    return Number.isInteger(t) ? t + 's' : t.toFixed(1) + 's';
  }
  if (t >= 0.4) {
    return t.toFixed(1) + 's';
  }
  return '1/' + Math.round(1 / t);
}

/** Short shutter form without the leading "1/" prefix growing too wide. */
export function formatShutterShort(t: number): string {
  return formatShutter(t);
}

export function formatIso(iso: number): string {
  return 'ISO ' + Math.round(iso);
}

export function formatIsoValue(iso: number): string {
  return String(Math.round(iso));
}

export function formatEv(ev: number): string {
  if (!isFinite(ev)) {
    return 'EV --';
  }
  return 'EV ' + ev.toFixed(1);
}

export function formatStops(stops: number): string {
  const abs = Math.abs(stops);
  const sign = stops >= 0 ? '+' : '-';
  const word = abs === 1 ? 'stop' : 'stops';
  return sign + abs.toFixed(1) + ' ' + word;
}

export function formatStopsShort(stops: number): string {
  const sign = stops >= 0 ? '+' : '-';
  return sign + Math.abs(stops).toFixed(1);
}

export function formatFocal(focal: number): string {
  return Math.round(focal) + 'mm';
}
