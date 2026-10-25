import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { roomImage } from '../data';
import { useRoom } from '../state';
import { colors, fonts, ui } from '../theme';

const guidance = [
  {
    title: 'The whole room.',
    description: 'Stand in a corner. Include the floor and ceiling.',
    name: 'Wide view',
  },
  {
    title: 'The other side.',
    description: 'Turn toward the opposite wall. Include doors and windows.',
    name: 'Other side',
  },
  {
    title: 'Your favorite corner.',
    description: 'Show the spot you’d like to change.',
    name: 'The details',
  },
];
export default function Capture() {
  const { photos, setPhotos } = useRoom();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const shot = guidance[Math.min(photos.length, 2)];
  async function pick(camera: boolean) {
    setError('');
    setBusy(true);
    try {
      if (camera && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Camera access is off. Enable it in settings, or choose photos.');
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: !camera,
        selectionLimit: 3 - photos.length,
      };
      const result = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled)
        setPhotos([...photos, ...result.assets.map((asset) => asset.uri)].slice(0, 3));
    } catch {
      setError('Couldn’t open your photos. Try again or use the sample room.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      back
      footer={
        <>
          <Button disabled={photos.length === 0} onPress={() => router.push('/preferences')}>
            Choose a style
          </Button>
          <Text style={[ui.small, { textAlign: 'center' }]}>Photos stay on this device.</Text>
        </>
      }
    >
      <View style={{ gap: 10 }}>
        <View style={ui.between}>
          <Text accessibilityRole="header" style={ui.title}>
            {photos.length === 3 ? 'All set.' : shot.title}
          </Text>
          <Text style={ui.small}>{photos.length}/3 photos</Text>
        </View>
        <Text style={ui.body}>
          {photos.length === 3 ? 'Time to make it yours.' : shot.description}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <Photo
          source={photos.length ? { uri: photos[photos.length - 1] } : roomImage}
          height={240}
          label={photos.length ? 'Your selected room photo' : 'Example of a wide room photo'}
        />
        {!photos.length && <Text style={ui.small}>Example framing</Text>}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {guidance.map((item, index) => (
          <View key={item.name} style={{ flex: 1, gap: 7 }}>
            <View style={s.slot}>
              {photos[index] ? (
                <>
                  <Image
                    source={{ uri: photos[index] }}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.name} photo`}
                    hitSlop={8}
                    style={s.remove}
                    onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                  >
                    <Text style={s.removeText}>Remove</Text>
                  </Pressable>
                </>
              ) : (
                <Text style={[ui.label, { color: colors.brown }]}>{index + 1}</Text>
              )}
            </View>
            <Text style={[ui.small, { textAlign: 'center', fontSize: 10 }]}>{item.name}</Text>
          </View>
        ))}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={[ui.body, { color: colors.error }]}>
          {error}
        </Text>
      ) : null}
      {photos.length < 3 && (
        <View style={{ gap: 10 }}>
          <Button onPress={() => pick(true)} loading={busy}>
            Take photo
          </Button>
          <Button onPress={() => pick(false)} secondary disabled={busy}>
            Choose photos
          </Button>
        </View>
      )}
      <TextAction
        onPress={() => {
          setPhotos([]);
          router.push('/preferences');
        }}
      >
        Use a sample room
      </TextAction>
    </Page>
  );
}
const s = StyleSheet.create({
  slot: {
    height: 76,
    borderRadius: 9,
    backgroundColor: colors.sand,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cream,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontFamily: fonts.medium, fontSize: 10, color: colors.forest },
});
