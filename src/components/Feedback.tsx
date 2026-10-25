import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoom } from '../state';
import { colors, fonts } from '../theme';
import { TextAction } from './ui';

export function StorageBanner() {
  const { storageError, retry } = useRoom();
  if (!storageError) return null;
  return (
    <View style={s.error} accessibilityRole="alert">
      <Text style={s.errorText}>{storageError}</Text>
      <TextAction onPress={retry}>Retry</TextAction>
    </View>
  );
}
export function Feedback() {
  const { notice, dismissNotice } = useRoom();
  if (!notice) return null;
  return (
    <View style={s.toast} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Text style={s.text}>{notice.text}</Text>
      {notice.undo && <TextAction onPress={notice.undo}>Undo</TextAction>}
      <TextAction label="Dismiss notification" onPress={dismissNotice}>
        Dismiss
      </TextAction>
    </View>
  );
}
const s = StyleSheet.create({
  error: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#F0DDD1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.regular,
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
  },
  toast: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 96,
    paddingHorizontal: 14,
    minHeight: 60,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 6px 18px rgba(38,62,46,.14)',
  },
  text: { flex: 1, fontFamily: fonts.medium, color: colors.forest, fontSize: 13 },
});
