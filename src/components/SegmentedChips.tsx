import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type ChipOption<T> = { value: T; label: string };

/** 44px segmented chip group (stop increment, theme mode). */
function SegmentedChips<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.group}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.chip, active ? styles.chipActive : null]}>
            <Text style={[styles.text, active ? styles.textActive : null]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chip: {
    minWidth: 56,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(42,133,171,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(42,133,171,0.22)',
  },
  chipActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 16,
    color: theme.colors.brand.primary,
  },
  textActive: { color: '#FFFFFF' },
});

export default SegmentedChips;
