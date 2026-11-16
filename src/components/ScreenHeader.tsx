import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { HEADER_CONTENT_H, HEADER_PAD_TOP } from '../constants/config';
import { LucideIcon } from '../constants/icons';

export function HeaderIconButton({
  Icon,
  onPress,
  label,
  tone = 'primary',
}: {
  Icon: LucideIcon;
  onPress: () => void;
  label: string;
  tone?: 'primary' | 'accent';
}) {
  const color =
    tone === 'accent' ? theme.colors.brand.accent : theme.colors.brand.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [
        styles.iconBtn,
        { borderColor: color + '3A', backgroundColor: color + '1A' },
        pressed ? styles.iconBtnPressed : null,
      ]}>
      <Icon size={22} color={color} strokeWidth={2} />
    </Pressable>
  );
}

/**
 * The ONE header used on every screen (Menu / Game / Result / Cheats /
 * Settings) — same height, same hairline, same padding. Screens differ only by
 * what they pass into leftSlot / rightSlot.
 */
function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  align = 'center',
  onDark = false,
}: {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'center' | 'left';
  onDark?: boolean;
}) {
  return (
    <View style={[styles.header, onDark ? styles.headerDark : null]}>
      <View style={styles.side}>{leftSlot ? leftSlot : null}</View>
      <View
        style={[
          styles.titleWrap,
          align === 'left' ? styles.titleLeft : styles.titleCenter,
        ]}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            align === 'left' ? styles.textLeft : styles.textCenter,
            onDark ? styles.titleOnDark : null,
          ]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              align === 'left' ? styles.textLeft : styles.textCenter,
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>
        {rightSlot ? rightSlot : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + HEADER_CONTENT_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.borderLight,
  },
  headerDark: {
    backgroundColor: 'rgba(24,33,36,0.55)',
    borderBottomColor: theme.colors.ui.borderOnDark,
  },
  side: {
    minWidth: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sideRight: { justifyContent: 'flex-end' },
  titleWrap: { flex: 1, justifyContent: 'center' },
  titleCenter: { alignItems: 'center' },
  titleLeft: { alignItems: 'flex-start' },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  titleOnDark: { color: theme.colors.text.onDark },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.brand.primary,
  },
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: { opacity: 0.72 },
});

export default React.memo(ScreenHeader);
