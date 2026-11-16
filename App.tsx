/**
 * Shutter Speed Helper — pure state-machine root (rule #2).
 * No @react-navigation: a Screen union plus conditional render.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import CheatCardsScreen from './src/screens/CheatCardsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {
  DEFAULT_LOCK,
  DEFAULT_SCENE_ID,
  DialKind,
  SCREEN_FADE_MS,
  sceneById,
} from './src/constants/config';
import theme from './src/constants/theme';
import { useSettings } from './src/hooks/useSettings';
import { Report } from './src/game/report';

type Screen = 'loader' | 'menu' | 'game' | 'result' | 'cheats' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [sceneId, setSceneId] = useState(DEFAULT_SCENE_ID);
  const [locked, setLocked] = useState<DialKind>(DEFAULT_LOCK);
  const [report, setReport] = useState<Report | null>(null);
  const [round, setRound] = useState(0);

  const settings = useSettings();
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: SCREEN_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [fade, screen]);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goCheats = useCallback(() => setScreen('cheats'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);

  const startGame = useCallback(() => {
    setRound(r => r + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((next: Report) => {
    setReport(next);
    setScreen('result');
  }, []);

  const playAgain = useCallback(() => {
    setRound(r => r + 1);
    setScreen('game');
  }, []);

  const scene = sceneById(sceneId);

  return (
    <View style={styles.root}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.layer, { opacity: fade }]}>
        {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

        {screen === 'menu' ? (
          <MenuScreen
            sceneId={sceneId}
            locked={locked}
            onPickScene={setSceneId}
            onPickLock={setLocked}
            onStart={startGame}
            onCheats={goCheats}
            onSettings={goSettings}
          />
        ) : null}

        {screen === 'game' ? (
          <GameScreen
            key={'round-' + round}
            scene={scene}
            initialLock={locked}
            ladders={settings.ladders}
            focal={settings.focal}
            haptics={settings.haptics}
            shutterWarnings={settings.shutterWarnings}
            onGameOver={handleGameOver}
            onMenu={goMenu}
          />
        ) : null}

        {screen === 'result' && report ? (
          <ResultScreen
            report={report}
            onPlayAgain={playAgain}
            onMenu={goMenu}
          />
        ) : null}

        {screen === 'cheats' ? <CheatCardsScreen onBack={goMenu} /> : null}

        {screen === 'settings' ? (
          <SettingsScreen settings={settings} onBack={goMenu} />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  layer: { flex: 1 },
});

export default App;
