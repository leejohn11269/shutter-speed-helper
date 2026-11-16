import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import {
  DIAL_COLORS,
  DIAL_LABELS,
  DIAL_ROW_H,
  DialKind,
  PULSE_MS,
} from '../constants/config';
import { icon } from '../constants/icons';
import StepperButton from './StepperButton';

const ROW_ICONS: Record<DialKind, string> = {
  aperture: 'aperture',
  shutter: 'clock',
  iso: 'gauge',
};

/** One camera dial: icon (tap to lock) + label/value + "-" / "+" steppers. */
function DialRow({
  kind,
  value,
  locked,
  canDec,
  canInc,
  pulse,
  onDec,
  onInc,
  onToggleLock,
}: {
  kind: DialKind;
  value: string;
  locked: boolean;
  canDec: boolean;
  canInc: boolean;
  pulse: number;
  onDec: (kind: DialKind) => void;
  onInc: (kind: DialKind) => void;
  onToggleLock: (kind: DialKind) => void;
}) {
  const color = DIAL_COLORS[kind];
  const Icon = icon(ROW_ICONS[kind]);
  const LockIcon = icon('lock');
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.12,
        duration: PULSE_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: PULSE_MS / 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulse, scale]);

  return (
    <View
      style={[
        styles.row,
        locked
          ? { borderColor: color, backgroundColor: color + '14' }
          : null,
      ]}>
      <Pressable
        onPress={() => onToggleLock(kind)}
        accessibilityRole="button"
        accessibilityLabel={'Lock ' + DIAL_LABELS[kind]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[styles.iconWrap, { backgroundColor: color + '26' }]}>
        <Icon size={20} color={color} strokeWidth={2.2} />
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.label} numberOfLines={1}>
          {DIAL_LABELS[kind]}
        </Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.value, { transform: [{ scale }] }]}>
          {value}
        </Animated.Text>
      </View>

      {locked ? (
        <View style={styles.lockedWrap}>
          <LockIcon size={14} color={color} strokeWidth={2.4} />
          <Text style={[styles.lockedText, { color }]}>LOCKED</Text>
        </View>
      ) : (
        <View style={styles.steppers}>
          <StepperButton
            glyph="-"
            disabled={!canDec}
            onPress={() => onDec(kind)}
            accessibilityLabel={'Decrease ' + DIAL_LABELS[kind]}
          />
          <StepperButton
            glyph="+"
            disabled={!canInc}
            onPress={() => onInc(kind)}
            accessibilityLabel={'Increase ' + DIAL_LABELS[kind]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: DIAL_ROW_H,
    borderRadius: 14,
    backgroundColor: theme.colors.ui.glassOnDark,
    borderWidth: 1,
    borderColor: theme.colors.ui.hairlineOnDark,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, paddingHorizontal: 10 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.mutedOnDark,
  },
  value: {
    marginTop: 1,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.onDark,
  },
  steppers: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
  },
  lockedText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 14,
  },
});

export default React.memo(DialRow);
