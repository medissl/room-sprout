import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, TextAction } from './ui';
import { colors, ui } from '../theme';

export function SilentRecorder({
  onCapture,
  onCancel,
}: {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}) {
  const [permission, request] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  async function record() {
    if (!ready || !camera.current) return;
    setError('');
    setRecording(true);
    try {
      const clip = await camera.current.recordAsync({
        maxDuration: 15,
        maxFileSize: 40 * 1024 * 1024,
      });
      if (active.current && clip) onCapture(clip.uri);
    } catch {
      if (active.current) setError('Recording could not start. Choose a clip instead.');
    } finally {
      if (active.current) setRecording(false);
    }
  }
  if (!permission) return <Text style={ui.body}>Checking camera access…</Text>;
  if (!permission.granted)
    return (
      <View style={{ gap: 12 }}>
        <Text style={ui.body}>Camera access lets you record a silent room sweep.</Text>
        <Button
          onPress={() => {
            void request();
          }}
        >
          Enable camera
        </Button>
        <TextAction onPress={onCancel}>Choose clip instead</TextAction>
      </View>
    );
  return (
    <View style={{ gap: 12 }}>
      <CameraView
        ref={camera}
        mode="video"
        facing="back"
        mute
        videoQuality="720p"
        onCameraReady={() => setReady(true)}
        onMountError={() => setError('Camera unavailable. Choose a clip instead.')}
        style={{ width: '100%', height: 260, borderRadius: 12, overflow: 'hidden' }}
      />
      <Text accessibilityRole="status" style={ui.small}>
        {recording
          ? 'Recording silently · 15 seconds maximum'
          : 'Start at the doorway. Pan slowly toward the window.'}
      </Text>
      <Button
        disabled={!ready}
        onPress={
          recording
            ? () => camera.current?.stopRecording()
            : () => {
                void record();
              }
        }
      >
        {recording ? 'Stop recording' : 'Start recording'}
      </Button>
      {!!error && (
        <Text accessibilityRole="alert" style={[ui.small, { color: colors.error }]}>
          {error}
        </Text>
      )}
      <TextAction
        onPress={() => {
          camera.current?.stopRecording();
          onCancel();
        }}
      >
        Cancel recording
      </TextAction>
    </View>
  );
}
