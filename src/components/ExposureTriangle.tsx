import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Polygon,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { DIAL_COLORS, DialKind, TRI_BOX } from '../constants/config';
import theme from '../constants/theme';

const LABEL_PAD = 30;
const SIDE_PAD = 44;

/**
 * The exposure triangle. Vertex labels sit OUTSIDE the triangle bounding box
 * (rule #17) and the decorative dial ticks are skipped in the label sectors so
 * nothing ever crosses a letter.
 */
function ExposureTriangle({
  apertureLabel,
  shutterLabel,
  isoLabel,
  locked,
  pulseKey,
}: {
  apertureLabel: string;
  shutterLabel: string;
  isoLabel: string;
  locked: DialKind;
  pulseKey: number;
}) {
  const size = TRI_BOX;
  const cx = size / 2;
  const topY = LABEL_PAD;
  const baseY = size - LABEL_PAD;
  const halfW = (size - SIDE_PAD * 2) / 2;
  const leftX = cx - halfW;
  const rightX = cx + halfW;

  const points =
    cx + ',' + topY + ' ' + leftX + ',' + baseY + ' ' + rightX + ',' + baseY;

  const halo = useRef(new Animated.Value(0)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    halo.setValue(0);
    Animated.sequence([
      Animated.timing(halo, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(halo, {
        toValue: 0,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, [halo, pulseKey]);

  const ticks: React.ReactNode[] = [];
  const tickR1 = size * 0.455;
  const tickR2 = size * 0.492;
  for (let i = 0; i < 24; i++) {
    const deg = i * 15;
    const norm = ((deg % 180) + 180) % 180;
    // skip the sectors where the vertex labels live
    if (norm > 62 && norm < 118) {
      continue;
    }
    const rad = (deg * Math.PI) / 180;
    const major = i % 6 === 0;
    ticks.push(
      <Line
        key={'tick-' + i}
        x1={cx + Math.cos(rad) * tickR1}
        y1={size / 2 + Math.sin(rad) * tickR1}
        x2={cx + Math.cos(rad) * tickR2}
        y2={size / 2 + Math.sin(rad) * tickR2}
        stroke={major ? '#E0902A' : 'rgba(176,186,221,0.22)'}
        strokeWidth={major ? 2 : 1}
      />,
    );
  }

  const vertex = (kind: DialKind, x: number, y: number) => {
    const color = DIAL_COLORS[kind];
    const isLocked = locked === kind;
    return (
      <React.Fragment key={'v-' + kind}>
        {isLocked ? (
          <Circle
            cx={x}
            cy={y}
            r={12}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.65}
          />
        ) : null}
        <Circle
          cx={x}
          cy={y}
          r={7}
          fill={isLocked ? color : theme.colors.surface.graphiteDeep}
          stroke={color}
          strokeWidth={2.2}
        />
      </React.Fragment>
    );
  };

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="triFill" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2A85AB" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#E028AE" stopOpacity={0.1} />
          </SvgLinearGradient>
        </Defs>
        {ticks}
        <Polygon
          points={points}
          fill="url(#triFill)"
          stroke="rgba(176,186,221,0.38)"
          strokeWidth={1.5}
        />
        {vertex('aperture', cx, topY)}
        {vertex('shutter', leftX, baseY)}
        {vertex('iso', rightX, baseY)}
        <SvgText
          x={cx}
          y={topY - 13}
          fill={theme.colors.text.onDark}
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle">
          {apertureLabel}
        </SvgText>
        <SvgText
          x={leftX - 2}
          y={baseY + 22}
          fill={theme.colors.text.onDark}
          fontSize={14}
          fontWeight="bold"
          textAnchor="start">
          {shutterLabel}
        </SvgText>
        <SvgText
          x={rightX + 2}
          y={baseY + 22}
          fill={theme.colors.text.onDark}
          fontSize={14}
          fontWeight="bold"
          textAnchor="end">
          {isoLabel}
        </SvgText>
      </Svg>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            left: cx - 18,
            top: topY - 18,
            borderColor: DIAL_COLORS.aperture,
            opacity: halo,
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            left: leftX - 18,
            top: baseY - 18,
            borderColor: DIAL_COLORS.shutter,
            opacity: halo,
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            left: rightX - 18,
            top: baseY - 18,
            borderColor: DIAL_COLORS.iso,
            opacity: halo,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  halo: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
});

export default React.memo(ExposureTriangle);
