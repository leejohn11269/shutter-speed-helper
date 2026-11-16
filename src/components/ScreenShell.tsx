import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { bgGame } from '../assets';
import { SCREEN_H, SCREEN_W } from '../constants/config';
import theme from '../constants/theme';

type Variant = 'light' | 'lightDeep' | 'dark';

const OVERLAYS: Record<Variant, string[]> = {
  light: ['rgba(237,244,246,0.93)', 'rgba(220,234,240,0.95)', 'rgba(207,226,235,0.97)'],
  lightDeep: ['rgba(242,248,250,0.94)', 'rgba(220,234,240,0.96)', 'rgba(200,223,233,0.98)'],
  dark: theme.gradients.dark as unknown as string[],
};

/**
 * Every screen sits on the one AI background (bg_game) and is told apart by
 * its gradient overlay — Loader is the dark one (rule #14).
 * Three depth layers: image -> gradient -> SVG blob decor -> content.
 */
function ScreenShell({
  variant = 'light',
  children,
}: {
  variant?: Variant;
  children: React.ReactNode;
}) {
  const dark = variant === 'dark';
  const blobA = dark ? '#2A85AB' : '#2A85AB';
  const blobB = dark ? '#E028AE' : '#B0BADD';

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={OVERLAYS[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Svg
          width={SCREEN_W}
          height={SCREEN_H}
          style={StyleSheet.absoluteFill}
          pointerEvents="none">
          <Defs>
            <RadialGradient id="blobA" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0"
                stopColor={blobA}
                stopOpacity={dark ? 0.22 : 0.14}
              />
              <Stop offset="1" stopColor={blobA} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="blobB" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0"
                stopColor={blobB}
                stopOpacity={dark ? 0.16 : 0.18}
              />
              <Stop offset="1" stopColor={blobB} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle
            cx={dark ? -20 : SCREEN_W - 30}
            cy={dark ? 10 : 90}
            r={290}
            fill="url(#blobA)"
          />
          <Circle
            cx={dark ? SCREEN_W + 20 : 10}
            cy={SCREEN_H - 120}
            r={300}
            fill="url(#blobB)"
          />
        </Svg>
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { flex: 1, width: '100%', height: '100%' },
  content: { flex: 1 },
});

export default React.memo(ScreenShell);
