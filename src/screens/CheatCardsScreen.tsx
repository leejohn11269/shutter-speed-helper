import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import CheatCard from '../components/CheatCard';
import theme from '../constants/theme';
import { CHEAT_CARDS, CheatCardData } from '../constants/config';
import { Icons } from '../constants/icons';
import { sprites } from '../assets';

/** Reference cards — a FlatList inside a flex:1 area, never a ScrollView wrapper. */
function CheatCardsScreen({ onBack }: { onBack: () => void }) {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<CheatCardData>) => (
      <CheatCard
        data={item}
        sprite={index < sprites.length ? sprites[index] : undefined}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: CheatCardData) => item.id, []);

  return (
    <ScreenShell variant="light">
      <ScreenHeader
        title="CHEAT CARDS"
        subtitle="POCKET REFERENCE"
        leftSlot={
          <HeaderIconButton Icon={Icons.back} onPress={onBack} label="Back" />
        }
      />
      <View style={styles.body}>
        <Text style={styles.hint}>THE NUMBERS WORTH MEMORISING</Text>
        <FlatList
          data={CHEAT_CARDS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16 },
  hint: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.secondary,
  },
  list: { flex: 1 },
  listContent: { paddingBottom: 20, gap: 10 },
});

export default CheatCardsScreen;
