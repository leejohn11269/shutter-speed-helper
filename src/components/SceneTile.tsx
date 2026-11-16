import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { Scene, SCENE_TILE_H, SCENE_TILE_W } from '../constants/config';
import { icon } from '../constants/icons';
import { usePressScale } from '../hooks/usePressScale';

/** Bento tile: icon square, scene name, target EV, selection dot. */
function SceneTile({
  scene,
  selected,
  index,
  onPress,
}: {
  scene: Scene;
  selected: boolean;
  index: number;
  onPress: (id: string) => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const entry = useRef(new Animated.Value(0)).current;
  const Icon = icon(scene.icon);

  useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 180,
      delay: index * 45,
      useNativeDriver: true,
    }).start();
  }, [entry, index]);

  const translateY = entry.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  return (
    <Pressable
      onPress={() => onPress(scene.id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={scene.name}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.tile,
          selected ? styles.tileSelected : null,
          { opacity: entry, transform: [{ translateY }, { scale }] },
        ]}>
        <View
          style={[styles.iconWrap, { backgroundColor: scene.color + '1F' }]}>
          <Icon size={22} color={scene.color} strokeWidth={2.2} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {scene.name}
        </Text>
        <Text style={styles.ev} numberOfLines={1}>
          {'EV ' + scene.targetEV}
        </Text>
        {selected ? <View style={styles.selDot} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: SCENE_TILE_W, height: SCENE_TILE_H },
  tile: {
    width: SCENE_TILE_W,
    height: SCENE_TILE_H,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1.5,
    borderColor: 'rgba(24,33,36,0.06)',
    padding: 12,
    justifyContent: 'center',
    shadowColor: theme.colors.brand.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileSelected: {
    borderColor: theme.colors.brand.accent,
    backgroundColor: '#FDF0F9',
    shadowColor: theme.colors.brand.accent,
    shadowOpacity: 0.22,
    elevation: 4,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
  },
  ev: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.brand.primary,
  },
  selDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
  },
});

export default React.memo(SceneTile);
