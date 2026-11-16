import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { LucideIcon } from '../constants/icons';
import { usePressScale } from '../hooks/usePressScale';

const ICON_SIZE = 24;

/** h48 tinted button. Same 24px icon + lineHeight:24 + gap:10 contract. */
function SecondaryButton({
  label,
  Icon,
  onPress,
  tone,
}: {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  tone?: string;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const color = tone || theme.colors.brand.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.shell,
          {
            backgroundColor: color + '1A',
            borderColor: color + '47',
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_SIZE} color={color} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  shell: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: ICON_SIZE,
  },
});

export default React.memo(SecondaryButton);
