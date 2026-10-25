import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect } from 'expo-router';
import { colors, ui } from '../theme';
export function ClipPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.muted = true;
    p.loop = false;
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useFocusEffect(
    useCallback(
      () => () => {
        player.pause();
      },
      [player],
    ),
  );
  return (
    <View style={{ gap: 8 }}>
      <VideoView
        accessibilityLabel="Your room clip"
        player={player}
        nativeControls
        style={s.video}
      />
      {status === 'error' && (
        <Text accessibilityRole="alert" style={[ui.small, { color: colors.error }]}>
          This clip cannot be previewed. Choose another MP4 clip.
        </Text>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  video: { width: '100%', height: 235, borderRadius: 12, backgroundColor: '#E3E7D5' },
});
