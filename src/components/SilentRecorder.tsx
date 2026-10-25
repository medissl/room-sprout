import React from 'react';
import { Text, View } from 'react-native';
import { ui } from '../theme';
import { TextAction } from './ui';
// Browser recording varies by browser; the setup screen offers a local clip picker.
export function SilentRecorder({
  onCancel,
}: {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}) {
  return (
    <View>
      <Text style={ui.body}>Choose a short room clip from your library.</Text>
      <TextAction onPress={onCancel}>Choose clip instead</TextAction>
    </View>
  );
}
