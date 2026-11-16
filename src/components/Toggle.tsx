import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

const TRACK_W = 52;
const TRACK_H = 32;
const KNOB = 26;

/** 52x32 animated switch — transform only, native driver (rule #8). */
function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: () => void;
  label: string;
}) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      tension: 180,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [anim, value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <View
        style={[
          styles.track,
          value ? styles.trackOn : styles.trackOff,
        ]}>
        <Animated.View
          style={[styles.knob, { transform: [{ translateX }] }]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: TRACK_W, height: 48, justifyContent: 'center' },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
    borderWidth: 1,
  },
  trackOn: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  trackOff: {
    backgroundColor: 'rgba(42,133,171,0.18)',
    borderColor: 'rgba(42,133,171,0.28)',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#182124',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default React.memo(Toggle);
