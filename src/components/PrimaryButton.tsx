import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { LucideIcon } from '../constants/icons';
import { usePressScale } from '../hooks/usePressScale';

const ICON_SIZE = 24;

/**
 * h60 gradient CTA. Icon is ALWAYS 24x24 and the label lineHeight is 24, in a
 * row with gap 10 — the rule #20 alignment contract, identical on every screen.
 * Pressable is the PARENT, Animated.View the child (rule #8).
 */
function PrimaryButton({
  label,
  Icon,
  onPress,
  colors,
  shadowColor,
  disabled,
}: {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  colors?: string[];
  shadowColor?: string;
  disabled?: boolean;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const palette = colors || (theme.gradients.action as unknown as string[]);
  const glow = shadowColor || theme.colors.brand.accent;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.shell,
          { shadowColor: glow, transform: [{ scale }] },
          disabled ? styles.disabled : null,
        ]}>
        <LinearGradient
          colors={palette}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 60 },
  shell: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    shadowOpacity: 0.38,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  disabled: { opacity: 0.45 },
  fill: {
    width: '100%',
    height: 60,
    borderRadius: 18,
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: ICON_SIZE,
    color: '#FFFFFF',
  },
});

export default React.memo(PrimaryButton);
