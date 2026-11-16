import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import theme from '../constants/theme';
import { SCREEN_H } from '../constants/config';
import { EquivalentRow } from '../game/exposure';
import { formatAperture, formatIso, formatShutter } from '../utils/format';

const TAG_COLORS: Record<EquivalentRow['tag'], string> = {
  SHARP: '#2BA06B',
  SHAKE: '#E0902A',
  GRAIN: '#E028AE',
};

const ROW_H = 52;

function Row({
  row,
  onPick,
}: {
  row: EquivalentRow;
  onPick: (row: EquivalentRow) => void;
}) {
  const tagColor = TAG_COLORS[row.tag];
  return (
    <Pressable
      onPress={() => onPick(row)}
      accessibilityRole="button"
      accessibilityLabel={'Apply ' + formatAperture(row.aperture)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.row, row.current ? styles.rowCurrent : null]}>
      <Text style={styles.cell}>{formatAperture(row.aperture)}</Text>
      <Text style={styles.cell}>{formatShutter(row.shutter)}</Text>
      <Text style={styles.cell}>{formatIso(row.iso)}</Text>
      <View style={[styles.tag, { backgroundColor: tagColor + '24' }]}>
        <Text style={[styles.tagText, { color: tagColor }]}>{row.tag}</Text>
      </View>
    </Pressable>
  );
}

const MemoRow = React.memo(Row);

/** Bottom sheet listing equal exposures — same brightness, different physics. */
function EquivalentsSheet({
  visible,
  rows,
  onPick,
  onClose,
}: {
  visible: boolean;
  rows: EquivalentRow[];
  onPick: (row: EquivalentRow) => void;
  onClose: () => void;
}) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EquivalentRow>) => (
      <MemoRow row={item} onPick={onPick} />
    ),
    [onPick],
  );

  const keyExtractor = useCallback((item: EquivalentRow) => item.key, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdropWrap}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Close equivalents"
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.grab} />
          <Text style={styles.title}>EQUAL EXPOSURES</Text>
          <Text style={styles.subtitle}>
            same brightness · different physics
          </Text>
          <FlatList
            data={rows}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={(_, index) => ({
              length: ROW_H,
              offset: ROW_H * index,
              index,
            })}
            initialNumToRender={9}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.closeBtn}>
            <Text style={styles.closeText}>CLOSE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropWrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.ui.scrim },
  sheet: {
    height: Math.round(SCREEN_H * 0.62),
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  grab: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: 'rgba(24,33,36,0.18)',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  list: { flex: 1, marginTop: 10 },
  listContent: { paddingBottom: 8 },
  row: {
    height: ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surface.alt,
    marginBottom: 4,
  },
  rowCurrent: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.brand.accent,
    backgroundColor: '#FDF0F9',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  tag: {
    width: 76,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, lineHeight: 14 },
  closeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.tintPrimary,
    borderWidth: 1,
    borderColor: theme.colors.ui.tintPrimaryStrong,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 18,
    color: theme.colors.brand.primary,
  },
});

export default React.memo(EquivalentsSheet);
