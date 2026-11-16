import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import ExposureTriangle from '../components/ExposureTriangle';
import DialRow from '../components/DialRow';
import StatStrip, { StripItem } from '../components/StatStrip';
import WarningBanner from '../components/WarningBanner';
import EquivalentsSheet from '../components/EquivalentsSheet';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import {
  DIAL_ORDER,
  DRIFT_CAUTION,
  DialKind,
  LOCK_HOLD_MS,
  Ladders,
  NOISE_CAUTION_ISO,
  Scene,
  TILE_GAP,
} from '../constants/config';
import { Icons } from '../constants/icons';
import { EquivalentRow, equivalents, handheldLimit } from '../game/exposure';
import { useExposure } from '../hooks/useExposure';
import { Report, buildReport } from '../game/report';
import {
  formatAperture,
  formatEv,
  formatIso,
  formatShutter,
  formatStopsShort,
} from '../utils/format';

/**
 * G3 Split Panel: the graphite camera-body module on top, a thin stat strip
 * and the CTA block in the thumb zone.
 */
function GameScreen({
  scene,
  initialLock,
  ladders,
  focal,
  haptics,
  shutterWarnings,
  onGameOver,
  onMenu,
}: {
  scene: Scene;
  initialLock: DialKind;
  ladders: Ladders;
  focal: number;
  haptics: boolean;
  shutterWarnings: boolean;
  onGameOver: (report: Report) => void;
  onMenu: () => void;
}) {
  const exposure = useExposure(
    scene,
    initialLock,
    ladders,
    focal,
    shutterWarnings,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const flash = useRef(new Animated.Value(0)).current;
  const lockingRef = useRef(false);

  const { triangle, locked, ev, stops, banner, pulseKey, step, canStepDial } =
    exposure;

  const onDec = useCallback((kind: DialKind) => step(kind, -1), [step]);
  const onInc = useCallback((kind: DialKind) => step(kind, 1), [step]);
  const onToggleLock = useCallback(
    (kind: DialKind) => exposure.setLocked(kind),
    [exposure],
  );

  const driftOff = Math.abs(stops) > DRIFT_CAUTION;

  const dialValue = useCallback(
    (kind: DialKind) => {
      if (kind === 'aperture') {
        return formatAperture(triangle.aperture);
      }
      if (kind === 'shutter') {
        return formatShutter(triangle.shutter);
      }
      return formatIso(triangle.iso);
    },
    [triangle],
  );

  const stripItems = useMemo<StripItem[]>(() => {
    const limit = handheldLimit(focal);
    const items: StripItem[] = [
      {
        id: 'drift',
        value: formatStopsShort(stops) + ' EV',
        label: driftOff ? 'OFF TARGET' : 'ON TARGET',
        color: driftOff ? theme.colors.brand.warning : theme.colors.brand.success,
      },
      {
        id: 'handheld',
        value: formatShutter(limit),
        label: 'HANDHELD MIN',
        color:
          triangle.shutter > limit * 1.05
            ? theme.colors.brand.accent
            : theme.colors.brand.primary,
      },
      {
        id: 'noise',
        value:
          triangle.iso <= 400 ? 'LOW' : triangle.iso <= NOISE_CAUTION_ISO ? 'MED' : 'HIGH',
        label: 'NOISE',
        color:
          triangle.iso <= 400
            ? theme.colors.brand.success
            : triangle.iso <= NOISE_CAUTION_ISO
            ? theme.colors.brand.warning
            : theme.colors.brand.accent,
      },
    ];
    return items;
  }, [driftOff, focal, stops, triangle.iso, triangle.shutter]);

  const equivalentRows = useMemo<EquivalentRow[]>(
    () => equivalents(triangle, ladders, focal),
    [focal, ladders, triangle],
  );

  const handlePick = useCallback(
    (row: EquivalentRow) => {
      exposure.apply({
        aperture: row.aperture,
        shutter: row.shutter,
        iso: row.iso,
      });
      setSheetOpen(false);
    },
    [exposure],
  );

  const handleLockExposure = useCallback(() => {
    if (lockingRef.current) {
      return;
    }
    lockingRef.current = true;
    if (haptics) {
      Vibration.vibrate(12);
    }
    Animated.sequence([
      Animated.timing(flash, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(flash, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    const report = buildReport(
      triangle,
      scene.id,
      scene.name,
      scene.targetEV,
      focal,
      shutterWarnings,
    );
    setTimeout(() => {
      lockingRef.current = false;
      onGameOver(report);
    }, LOCK_HOLD_MS);
  }, [
    flash,
    focal,
    haptics,
    onGameOver,
    scene.id,
    scene.name,
    scene.targetEV,
    shutterWarnings,
    triangle,
  ]);

  const evColor = driftOff
    ? theme.colors.brand.accent
    : theme.colors.brand.primary;

  return (
    <ScreenShell variant="light">
      <ScreenHeader
        title={scene.name}
        subtitle={'TARGET EV ' + scene.targetEV}
        leftSlot={
          <HeaderIconButton Icon={Icons.back} onPress={onMenu} label="Back" />
        }
        rightSlot={
          <View style={[styles.evPill, { backgroundColor: evColor + '1A' }]}>
            <Text style={[styles.evText, { color: evColor }]}>
              {formatEv(ev)}
            </Text>
          </View>
        }
      />

      <View style={styles.area}>
        <LinearGradient
          colors={theme.gradients.graphite as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.module}>
          <View style={styles.triWrap}>
            <ExposureTriangle
              apertureLabel={formatAperture(triangle.aperture)}
              shutterLabel={formatShutter(triangle.shutter)}
              isoLabel={formatIso(triangle.iso)}
              locked={locked}
              pulseKey={pulseKey}
            />
          </View>

          <View style={styles.dials}>
            {DIAL_ORDER.map(kind => (
              <DialRow
                key={kind}
                kind={kind}
                value={dialValue(kind)}
                locked={locked === kind}
                canDec={canStepDial(kind, -1)}
                canInc={canStepDial(kind, 1)}
                pulse={pulseKey}
                onDec={onDec}
                onInc={onInc}
                onToggleLock={onToggleLock}
              />
            ))}
          </View>

          <Animated.View
            pointerEvents="none"
            style={[styles.flash, { opacity: flash }]}
          />
        </LinearGradient>
      </View>

      <StatStrip items={stripItems} />

      <View style={styles.controls}>
        {banner ? <WarningBanner warning={banner} /> : null}
        <View style={styles.ctaWrap}>
          <PrimaryButton
            label="LOCK EXPOSURE"
            Icon={Icons.check}
            onPress={handleLockExposure}
          />
        </View>
        <SecondaryButton
          label="SHOW EQUIVALENTS"
          Icon={Icons.grid}
          onPress={() => setSheetOpen(true)}
        />
      </View>

      <EquivalentsSheet
        visible={sheetOpen}
        rows={equivalentRows}
        onPick={handlePick}
        onClose={() => setSheetOpen(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  module: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(176,186,221,0.22)',
    padding: 14,
    shadowColor: theme.colors.surface.ink,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  triWrap: {
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dials: { gap: TILE_GAP, marginTop: 10 },
  flash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(43,160,107,0.22)',
  },
  evPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evText: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 18,
  },
  controls: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
    gap: 10,
  },
  ctaWrap: { width: '100%' },
});

export default GameScreen;
