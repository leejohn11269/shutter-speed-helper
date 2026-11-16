import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { LucideIcon } from '../constants/icons';

/** White 64px row: icon square + label/hint + control slot. */
function SettingRow({
  Icon,
  label,
  hint,
  children,
}: {
  Icon: LucideIcon;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Icon size={20} color={theme.colors.brand.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {hint ? (
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
        ) : null}
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    backgroundColor: theme.colors.surface.card,
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderLight,
    shadowColor: theme.colors.brand.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.ui.tintPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, paddingHorizontal: 10 },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  hint: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  control: { alignItems: 'flex-end', justifyContent: 'center' },
});

export default React.memo(SettingRow);
