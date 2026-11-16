import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { STAT_STRIP_H } from '../constants/config';

export type StripItem = {
  id: string;
  value: string;
  label: string;
  color: string;
};

/**
 * Thin 3-slot readout under the dial module. Renders nothing when fewer than
 * two slots have a value — a lone pill looks orphaned (rule #21).
 * Slot content uses width:'100%', never flex:1 inside the flex:1 slot.
 */
function StatStrip({ items }: { items: StripItem[] }) {
  if (items.length < 2) {
    return null;
  }
  return (
    <View style={styles.strip}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[styles.slot, index > 0 ? styles.divider : null]}>
          <View style={styles.inner}>
            <View style={styles.valueRow}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text
                style={[styles.value, { color: item.color }]}
                numberOfLines={1}>
                {item.value}
              </Text>
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: STAT_STRIP_H,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.brand.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  slot: {
    flex: 1,
    height: STAT_STRIP_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(24,33,36,0.08)',
  },
  inner: { width: '100%', alignItems: 'center' },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  value: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StatStrip);
