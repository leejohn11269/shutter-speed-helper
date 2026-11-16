import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import BrandLockup from '../components/BrandLockup';
import SceneTile from '../components/SceneTile';
import LockChip from '../components/LockChip';
import PrimaryButton from '../components/PrimaryButton';
import theme from '../constants/theme';
import {
  DIAL_COLORS,
  DialKind,
  LOCK_OPTIONS,
  SCENES,
  SCENE_GRID_W,
  TILE_GAP,
} from '../constants/config';
import { Icons } from '../constants/icons';

/**
 * M3 Bento-Hub: scene tiles fill the body, the lock chips and the one big
 * START CTA sit in the thumb zone. The hint line is ABOVE what it describes
 * (rule #19).
 */
function MenuScreen({
  sceneId,
  locked,
  onPickScene,
  onPickLock,
  onStart,
  onCheats,
  onSettings,
}: {
  sceneId: string;
  locked: DialKind;
  onPickScene: (id: string) => void;
  onPickLock: (kind: DialKind) => void;
  onStart: () => void;
  onCheats: () => void;
  onSettings: () => void;
}) {
  const ctaEntry = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(ctaEntry, {
      toValue: 1,
      tension: 48,
      friction: 7,
      delay: 420,
      useNativeDriver: true,
    }).start();
  }, [ctaEntry]);

  const handleLock = useCallback(
    (kind: DialKind) => onPickLock(kind),
    [onPickLock],
  );

  const ctaY = ctaEntry.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  return (
    <ScreenShell variant="light">
      <ScreenHeader
        title=""
        align="left"
        leftSlot={<BrandLockup size="header" />}
        rightSlot={
          <>
            <HeaderIconButton
              Icon={Icons.grid}
              onPress={onCheats}
              label="Cheat cards"
            />
            <HeaderIconButton
              Icon={Icons.settings}
              onPress={onSettings}
              label="Settings"
            />
          </>
        }
      />

      <View style={styles.body}>
        <Text style={styles.hint}>PICK YOUR LIGHT</Text>

        <View style={styles.grid}>
          {SCENES.map((scene, index) => (
            <SceneTile
              key={scene.id}
              scene={scene}
              index={index}
              selected={scene.id === sceneId}
              onPress={onPickScene}
            />
          ))}
        </View>

        <Text style={styles.hint}>HOLD ONE VALUE</Text>
        <View style={styles.chips}>
          {LOCK_OPTIONS.map(opt => (
            <LockChip
              key={opt.kind}
              label={opt.label}
              active={opt.kind === locked}
              color={DIAL_COLORS[opt.kind]}
              onPress={() => handleLock(opt.kind)}
            />
          ))}
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.ctaWrap,
            { opacity: ctaEntry, transform: [{ translateY: ctaY }] },
          ]}>
          <PrimaryButton
            label="START SHOOTING"
            Icon={Icons.camera}
            onPress={onStart}
          />
        </Animated.View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, alignItems: 'center' },
  hint: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.6,
    color: theme.colors.text.secondary,
  },
  grid: {
    width: SCENE_GRID_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
    justifyContent: 'center',
  },
  chips: {
    width: SCENE_GRID_W,
    flexDirection: 'row',
    gap: 8,
  },
  ctaWrap: {
    width: SCENE_GRID_W,
    marginTop: 'auto',
    marginBottom: 18,
    paddingTop: 16,
  },
});

export default MenuScreen;
