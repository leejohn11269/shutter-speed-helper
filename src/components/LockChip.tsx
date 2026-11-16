import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

/** h40 chip picking which value the photographer wants to hold. */
function LockChip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.chip,
          {
            backgroundColor: active ? color : color + '14',
            borderColor: active ? color : color + '38',
            transform: [{ scale }],
          },
        ]}>
        <Text
          numberOfLines={1}
          style={[styles.label, { color: active ? '#FFFFFF' : color }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1, height: 40 },
  chip: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 16,
  },
});

export default React.memo(LockChip);
