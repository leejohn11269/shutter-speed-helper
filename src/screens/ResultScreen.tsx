import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import { Icons } from '../constants/icons';
import { sprite1 } from '../assets';
import { Report, Tip, buildTips } from '../game/report';
import {
  formatAperture,
  formatIso,
  formatShutter,
  formatStops,
} from '../utils/format';

function TipRow({ tip }: { tip: Tip }) {
  return (
    <View style={[styles.tip, { borderLeftColor: tip.color }]}>
      <View style={[styles.tipDot, { backgroundColor: tip.color }]} />
      <Text style={styles.tipText} numberOfLines={3}>
        {tip.text}
      </Text>
    </View>
  );
}

const MemoTipRow = React.memo(TipRow);

/** The game-over screen (rule #12): grade, stat cards, tips, SHOOT AGAIN. */
function ResultScreen({
  report,
  onPlayAgain,
  onMenu,
}: {
  report: Report;
  onPlayAgain: () => void;
  onMenu: () => void;
}) {
  const card = useRef(new Animated.Value(0)).current;
  const stats = useRef(new Animated.Value(0)).current;
  const tips = useMemo(() => buildTips(report), [report]);

  useEffect(() => {
    Animated.spring(card, {
      toValue: 1,
      tension: 48,
      friction: 7,
      useNativeDriver: true,
    }).start();
    Animated.timing(stats, {
      toValue: 1,
      duration: 220,
      delay: 120,
      useNativeDriver: true,
    }).start();
  }, [card, stats]);

  const renderTip = useCallback(
    ({ item }: ListRenderItemInfo<Tip>) => <MemoTipRow tip={item} />,
    [],
  );
  const keyExtractor = useCallback((item: Tip) => item.id, []);

  const triangleLine =
    formatAperture(report.triangle.aperture) +
    ' · ' +
    formatShutter(report.triangle.shutter) +
    ' · ' +
    formatIso(report.triangle.iso);

  const evLine =
    'EV ' +
    report.ev.toFixed(1) +
    ' · target ' +
    report.targetEV.toFixed(1) +
    ' · ' +
    formatStops(report.stops);

  const cardY = card.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const statsY = stats.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <ScreenShell variant="lightDeep">
      <ScreenHeader
        title="EXPOSURE REPORT"
        subtitle={report.sceneName}
        leftSlot={
          <HeaderIconButton Icon={Icons.close} onPress={onMenu} label="Close" />
        }
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.verdict,
            {
              borderColor: report.gradeColor + '66',
              shadowColor: report.gradeColor,
              opacity: card,
              transform: [{ translateY: cardY }],
            },
          ]}>
          <Text style={[styles.grade, { color: report.gradeColor }]}>
            {report.grade}
          </Text>
          <Text style={styles.triangle}>{triangleLine}</Text>
          <Text style={styles.evLine}>{evLine}</Text>
          <Image source={sprite1} style={styles.sprite} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.statsRow,
            { opacity: stats, transform: [{ translateY: statsY }] },
          ]}>
          <View style={styles.statSlot}>
            <StatCard
              value={report.sharpness + '%'}
              label="SHARPNESS"
              valueColor={
                report.sharpness >= 85
                  ? theme.colors.brand.success
                  : theme.colors.brand.warning
              }
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={report.noiseLabel}
              label="NOISE"
              valueColor={
                report.noiseLabel === 'LOW'
                  ? theme.colors.brand.primary
                  : report.noiseLabel === 'MED'
                  ? theme.colors.brand.warning
                  : theme.colors.brand.accent
              }
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={Math.abs(report.stops).toFixed(1)}
              label="STOPS OFF"
              valueColor={
                Math.abs(report.stops) <= 0.34
                  ? theme.colors.brand.success
                  : theme.colors.brand.warning
              }
            />
          </View>
        </Animated.View>

        <Text style={styles.sectionHint}>WHAT TO FIX NEXT</Text>
        <FlatList
          data={tips}
          renderItem={renderTip}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.ctaWrap}>
          <PrimaryButton
            label="SHOOT AGAIN"
            Icon={Icons.redo}
            onPress={onPlayAgain}
          />
        </View>
        <SecondaryButton
          label="BACK TO SCENES"
          Icon={Icons.grid}
          onPress={onMenu}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, paddingBottom: 18 },
  verdict: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.card,
    padding: 18,
    paddingRight: 96,
    borderWidth: 1.5,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  grade: { fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  triangle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  evLine: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  sprite: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 72,
    height: 72,
    opacity: 0.95,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statSlot: { flex: 1 },
  sectionHint: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.secondary,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: 6 },
  tip: {
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipDot: { width: 8, height: 8, borderRadius: 4 },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
  ctaWrap: { width: '100%', marginTop: 10, marginBottom: 10 },
});

export default ResultScreen;
