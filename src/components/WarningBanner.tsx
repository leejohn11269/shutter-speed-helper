import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { SEVERITY_COLORS, Warning } from '../game/warnings';
import { icon } from '../constants/icons';

/** Amber / magenta banner above the CTA. Slides up 10px and fades in. */
function WarningBanner({ warning }: { warning: Warning }) {
  const entry = useRef(new Animated.Value(0)).current;
  const Icon = icon('warning');
  const color = SEVERITY_COLORS[warning.severity];

  useEffect(() => {
    entry.setValue(0);
    Animated.timing(entry, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [entry, warning.id]);

  const translateY = entry.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.banner,
        {
          backgroundColor: color + '1F',
          borderColor: color + '73',
          opacity: entry,
          transform: [{ translateY }],
        },
      ]}>
      <Icon size={20} color={color} strokeWidth={2.2} />
      <Text style={styles.text} numberOfLines={2}>
        {warning.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    color: '#7A4E0E',
  },
});

export default React.memo(WarningBanner);
