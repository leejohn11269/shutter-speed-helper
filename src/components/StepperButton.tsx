import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

/**
 * 48x48 stepper. ASCII glyphs only: "-" and "+" (rule #15 — no chevrons,
 * arrows or triangles, Roboto renders those as tofu on Android).
 */
function StepperButton({
  glyph,
  disabled,
  onPress,
  accessibilityLabel,
  tone = 'dark',
}: {
  glyph: '-' | '+';
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  tone?: 'dark' | 'light';
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.btn,
          tone === 'light' ? styles.btnLight : null,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <Text
          style={[styles.glyph, tone === 'light' ? styles.glyphLight : null]}>
          {glyph}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 48, height: 48 },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLight: {
    backgroundColor: 'rgba(42,133,171,0.10)',
    borderColor: 'rgba(42,133,171,0.28)',
  },
  disabled: { opacity: 0.35 },
  glyphLight: { color: theme.colors.brand.primary },
  glyph: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    color: theme.colors.text.onDark,
  },
});

export default React.memo(StepperButton);
