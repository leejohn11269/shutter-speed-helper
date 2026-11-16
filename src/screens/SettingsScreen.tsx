import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import SettingRow from '../components/SettingRow';
import SegmentedChips from '../components/SegmentedChips';
import Toggle from '../components/Toggle';
import StepperButton from '../components/StepperButton';
import theme from '../constants/theme';
import {
  FOCAL_LENGTHS,
  STOP_OPTIONS,
  StopIncrement,
} from '../constants/config';
import { Icons } from '../constants/icons';
import { SettingsApi, ThemeMode } from '../hooks/useSettings';
import { formatFocal } from '../utils/format';

const MODE_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'LIGHT' },
  { value: 'graphite', label: 'GRAPHITE' },
];

function SettingsScreen({
  settings,
  onBack,
}: {
  settings: SettingsApi;
  onBack: () => void;
}) {
  const focalIdx = FOCAL_LENGTHS.indexOf(settings.focal);

  return (
    <ScreenShell variant="light">
      <ScreenHeader
        title="SETTINGS"
        subtitle="ALL ON THIS DEVICE"
        leftSlot={
          <HeaderIconButton Icon={Icons.back} onPress={onBack} label="Back" />
        }
      />
      <View style={styles.body}>
        <Text style={styles.hint}>HOW THE DIALS BEHAVE</Text>

        <SettingRow Icon={Icons.aperture} label="Stop increment">
          <SegmentedChips<StopIncrement>
            options={STOP_OPTIONS}
            value={settings.increment}
            onChange={settings.setIncrement}
          />
        </SettingRow>

        <SettingRow
          Icon={Icons.ruler}
          label="Focal length"
          hint="Sets the shake limit">
          <View style={styles.focalRow}>
            <StepperButton
              glyph="-"
              tone="light"
              disabled={focalIdx <= 0}
              onPress={() => settings.stepFocal(-1)}
              accessibilityLabel="Shorter lens"
            />
            <Text style={styles.focalValue}>{formatFocal(settings.focal)}</Text>
            <StepperButton
              glyph="+"
              tone="light"
              disabled={focalIdx >= FOCAL_LENGTHS.length - 1}
              onPress={() => settings.stepFocal(1)}
              accessibilityLabel="Longer lens"
            />
          </View>
        </SettingRow>

        <SettingRow Icon={Icons.bulb} label="Dial module theme">
          <SegmentedChips<ThemeMode>
            options={MODE_OPTIONS}
            value={settings.mode}
            onChange={settings.setMode}
          />
        </SettingRow>

        <SettingRow Icon={Icons.vibrate} label="Haptics">
          <Toggle
            value={settings.haptics}
            onChange={settings.toggleHaptics}
            label="Haptics"
          />
        </SettingRow>

        <SettingRow Icon={Icons.warning} label="Shutter warnings">
          <Toggle
            value={settings.shutterWarnings}
            onChange={settings.toggleShutterWarnings}
            label="Shutter warnings"
          />
        </SettingRow>

        <Text style={styles.footer}>All data stays on this device.</Text>
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
  focalRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  focalValue: {
    minWidth: 62,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  footer: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});

export default SettingsScreen;
