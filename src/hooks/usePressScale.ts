import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Shared press-feedback animation.
 *
 * Usage contract (rule #8 / ui-pressable): the <Pressable> is the PARENT and
 * owns onPressIn/onPressOut, the <Animated.View style={{transform:[{scale}]}}>
 * is its CHILD. Never the inverse — an Animated.View wrapping a Pressable eats
 * the tap on Android release builds.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: 300,
      friction: 16,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 16,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
