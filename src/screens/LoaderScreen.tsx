import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import ScreenShell from '../components/ScreenShell';
import BrandLockup from '../components/BrandLockup';
import { logo } from '../assets';
import theme from '../constants/theme';
import { LOADER_DURATION_MS, LOADER_PROGRESS_MS } from '../constants/config';

const BAR_W = 180;
const RING = 164;

/**
 * The one DARK screen in the app (rule #14) — same bg_game image as the Menu
 * but under an opaque graphite overlay, so Loader and Menu are far apart in
 * pHash. No chips, no scene tiles, no interactive call-to-action here.
 */
function LoaderScreen({ onDone }: { onDone: () => void }) {
  const badge = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(badge, {
      toValue: 1,
      tension: 52,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.timing(title, {
      toValue: 1,
      duration: 380,
      delay: 260,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    // width is a layout prop — the one place useNativeDriver must be false
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS - 300);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [badge, fade, onDone, progress, spin, title]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const titleY = title.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });
  const barW = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <ScreenShell variant="dark">
      <Animated.View
        pointerEvents="box-none"
        style={[styles.root, { opacity: fade }]}>
        <View style={styles.center}>
          <View style={styles.ringBox}>
            <Animated.View
              pointerEvents="none"
              style={[styles.ring, { transform: [{ rotate }] }]}>
              <Svg width={RING} height={RING}>
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RING / 2 - 4}
                  stroke={theme.colors.brand.primary}
                  strokeWidth={2}
                  strokeDasharray="6 10"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={[
                styles.badgeWrap,
                {
                  opacity: badge,
                  transform: [
                    {
                      scale: badge.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.82, 1],
                      }),
                    },
                  ],
                },
              ]}>
              <LinearGradient
                colors={theme.gradients.graphiteBadge as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badge}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              </LinearGradient>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.titleWrap,
              { opacity: title, transform: [{ translateY: titleY }] },
            ]}>
            <BrandLockup size="loader" />
            <Text style={styles.tagline}>MANUAL EXPOSURE ASSISTANT</Text>
          </Animated.View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barW }]}>
              <LinearGradient
                colors={theme.gradients.meter as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING…</Text>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  ringBox: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute', width: RING, height: RING },
  badgeWrap: {
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  badge: {
    width: 132,
    height: 132,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(176,186,221,0.35)',
  },
  logo: { width: 88, height: 88 },
  titleWrap: { marginTop: 30, alignItems: 'center' },
  tagline: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.text.mutedOnDark,
  },
  bottom: { position: 'absolute', bottom: 74, alignItems: 'center' },
  track: {
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(176,186,221,0.22)',
    overflow: 'hidden',
  },
  fillWrap: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { flex: 1, height: 4 },
  loading: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: 'rgba(176,186,221,0.75)',
  },
});

export default LoaderScreen;
