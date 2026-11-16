import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CheatCardData } from '../constants/config';
import { icon } from '../constants/icons';

/**
 * Quick-reference card. The optional sprite is a plain transparent <Image>
 * with POSITIVE offsets (rule #18) — never an overflow:hidden rounded wrapper.
 */
function CheatCard({
  data,
  sprite,
}: {
  data: CheatCardData;
  sprite?: ImageSourcePropType;
}) {
  const Icon = icon(data.icon);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <Text style={styles.body} numberOfLines={1}>
            {data.body}
          </Text>
        </View>
        <View style={styles.iconWrap}>
          <Icon size={20} color={theme.colors.brand.primary} strokeWidth={2.2} />
        </View>
      </View>

      <View style={styles.pills}>
        {data.pills.map(p => (
          <View key={p} style={styles.pill}>
            <Text style={styles.pillText}>{p}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footnote}>{data.footnote}</Text>

      {sprite ? (
        <Image source={sprite} style={styles.sprite} resizeMode="contain" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: theme.colors.surface.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderLight,
    shadowColor: theme.colors.brand.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start' },
  headText: { flex: 1, paddingRight: 10 },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.brand.primary,
  },
  body: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.ui.tintPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pills: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingRight: 64,
  },
  pill: {
    height: 30,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(42,133,171,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(42,133,171,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    lineHeight: 16,
    color: theme.colors.text.primary,
  },
  footnote: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    color: theme.colors.text.secondary,
    paddingRight: 64,
  },
  sprite: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 56,
    height: 56,
    opacity: 0.9,
  },
});

export default React.memo(CheatCard);
