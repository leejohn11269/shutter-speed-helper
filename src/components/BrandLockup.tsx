import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

/** The two-line SHUTTER SPEED / HELPER mark. */
function BrandLockup({ size = 'loader' }: { size?: 'loader' | 'header' }) {
  const loader = size === 'loader';
  return (
    <View style={[styles.wrap, loader ? null : styles.wrapHeader]}>
      <Text
        style={[
          styles.top,
          loader ? styles.topLoader : styles.topHeader,
        ]}>
        SHUTTER SPEED
      </Text>
      <Text
        style={[
          styles.bottom,
          loader ? styles.bottomLoader : styles.bottomHeader,
        ]}>
        HELPER
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  wrapHeader: { alignItems: 'flex-start' },
  top: { fontWeight: '800' },
  topLoader: {
    fontSize: 28,
    letterSpacing: 5,
    color: '#F3F9FB',
    lineHeight: 34,
  },
  topHeader: {
    fontSize: 13,
    letterSpacing: 2.4,
    color: theme.colors.brand.primary,
    lineHeight: 17,
  },
  bottom: { fontWeight: '800' },
  bottomLoader: {
    fontSize: 28,
    letterSpacing: 10,
    color: theme.colors.brand.accent,
    lineHeight: 34,
    marginTop: 2,
  },
  bottomHeader: {
    fontSize: 19,
    letterSpacing: 1,
    color: theme.colors.text.primary,
    lineHeight: 23,
  },
});

export default React.memo(BrandLockup);
