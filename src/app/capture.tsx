import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { ClipPreview } from '../components/ClipPreview';
import { SilentRecorder } from '../components/SilentRecorder';
import { referencePhoto } from '../media';
import { moods, parseBudget, picksWithinBudget, roomImage } from '../data';
import { type InputMode } from '../model';
import { useRoom } from '../state';
import { colors, fonts, ui } from '../theme';

const angles = ['Photo 1', 'Photo 2', 'Photo 3'];
const guidance = [
  'Stand in a corner. Include the floor and ceiling.',
  'Include the opposite wall, doors, and windows.',
  'Show the spot you want to change.',
];

export default function Capture() {
  const { id, step, from, returnTo } = useLocalSearchParams<{
    id?: string;
    step?: string;
    from?: string;
    returnTo?: string;
  }>();
  const returnToPlan = returnTo === 'plan';
  const store = useRoom();
  const created = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const project = store.projects.find((p) => p.id === id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [recording, setRecording] = useState(false);
  const stage = step === 'style' ? 'style' : 'room';
  useEffect(() => {
    if (id || !store.ready || created.current) return;
    created.current = true;
    const room = store.createRoom();
    if (room) router.setParams({ id: room.id });
  }, [id, store]);
  const close = async () => {
    Keyboard.dismiss();
    await store.flush();
    if (returnToPlan) {
      returnToEditor();
      return;
    }
    router.dismissTo(from === 'rooms' ? '/studio/rooms' : '/studio');
  };
  function returnToEditor() {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/result', params: { id: id || '', from: from || 'rooms' } });
  }
  if (!project)
    return (
      <Page
        title="Room setup"
        onClose={() => {
          void close();
        }}
      >
        <Text style={ui.heading}>{store.ready ? 'Room not available.' : 'Loading your room…'}</Text>
        {store.ready && (
          <Button onPress={() => router.replace('/studio/rooms')}>View my rooms</Button>
        )}
      </Page>
    );
  const clip = store.clips[project.id];
  const inputReady =
    project.mode === 'sample' ||
    (project.mode === 'photos' && project.photos.length > 0) ||
    (project.mode === 'video' && !!clip);
  const budget = parseBudget(project.budget);
  const formReady = inputReady && !!project.name.trim() && budget !== null;
  const update = (patch: Parameters<typeof store.updateRoom>[1]) =>
    store.updateRoom(project.id, patch);
  async function pick(camera: boolean) {
    if (busy || !project) return;
    const video = project.mode === 'video';
    if (!video && project.photos.length >= 3) return;
    setError('');
    setBusy(true);
    try {
      if (camera && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Camera access is off. Choose from your library instead.');
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: video ? ['videos'] : ['images'],
        quality: 0.8,
        allowsMultipleSelection: !camera && !video,
        selectionLimit: video ? 1 : 3 - project.photos.length,
        videoMaxDuration: 15,
      };
      const result = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled || !mounted.current) return;
      if (video) {
        const asset = result.assets[0];
        if (asset.type && asset.type !== 'video') {
          setError('Choose a video clip.');
          return;
        }
        if ((asset.duration ?? 0) > 15500) {
          setError('Choose a clip of 15 seconds or less.');
          return;
        }
        if ((asset.fileSize ?? 0) > 40 * 1024 * 1024) {
          setError('Choose a clip smaller than 40 MB.');
          return;
        }
        store.setClip(project.id, { uri: asset.uri, duration: asset.duration ?? 0 });
        store.notify('Room clip added');
      } else {
        const photos = await Promise.all(
          result.assets.slice(0, 3 - project.photos.length).map(referencePhoto),
        );
        if (!mounted.current) return;
        update((latest) => ({ photos: [...latest.photos, ...photos].slice(0, 3) }));
        setSelectedPhoto(project.photos.length);
        store.notify(photos.length > 1 ? 'Room photos added' : 'Room photo added');
      }
    } catch {
      if (mounted.current)
        setError('Could not open that media. Try another file or choose Sample.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function next() {
    if (!project) return;
    Keyboard.dismiss();
    if (stage === 'room') {
      if (!inputReady) return;
      if (returnToPlan && project.prepared) {
        update({ stage: 'plan' });
        await store.flush();
        returnToEditor();
        return;
      }
      update({ stage: 'style' });
      router.setParams({ step: 'style' });
      return;
    }
    if (!formReady || budget === null) return;
    update({
      name: project.name.trim(),
      stage: 'plan',
      prepared: true,
      items: project.prepared ? project.items : picksWithinBudget(budget).map((p) => p.id),
    });
    await store.flush();
    router.replace({ pathname: '/result', params: { id: project.id, from: from || 'discover' } });
  }
  return (
    <Page
      title="Room setup"
      onClose={() => {
        void close();
      }}
      footer={
        <>
          <Button
            disabled={busy || recording || (stage === 'room' ? !inputReady : !formReady)}
            onPress={() => {
              void next();
            }}
          >
            {stage === 'room' ? (returnToPlan ? 'Use references' : 'Continue') : 'Preview my plan'}
          </Button>
          <Text style={[ui.small, { textAlign: 'center' }]}>
            {store.status === 'saving'
              ? 'Saving your draft…'
              : store.status === 'error'
                ? 'Draft kept in this session'
                : 'Draft saved on this device'}
          </Text>
        </>
      }
    >
      {!returnToPlan && (
        <View style={s.steps} accessibilityRole="tablist">
          {(['room', 'style'] as const).map((item, index) => (
            <Pressable
              key={item}
              accessibilityRole="tab"
              accessibilityLabel={item === 'room' ? 'Room input step' : 'Style and budget step'}
              aria-selected={stage === item}
              disabled={recording || (item === 'style' && !inputReady)}
              onPress={() => {
                setError('');
                router.setParams({ step: item });
              }}
              style={[
                s.step,
                stage === item && s.stepActive,
                item === 'style' && !inputReady && { opacity: 0.45 },
              ]}
            >
              <Text style={ui.label}>
                {index + 1}. {item === 'room' ? 'Your room' : 'Your style'}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {stage === 'room' ? (
        <>
          <Text accessibilityRole="header" style={ui.title}>
            Meet your room.
          </Text>
          <View
            style={s.modes}
            accessibilityRole="radiogroup"
            accessibilityLabel="Room input method"
          >
            {(['photos', 'video', 'sample'] as InputMode[]).map((mode) => (
              <Pressable
                key={mode}
                accessibilityRole="radio"
                accessibilityLabel={
                  mode === 'video' ? 'Room clip' : mode === 'photos' ? 'Room photos' : 'Sample room'
                }
                aria-checked={project.mode === mode}
                disabled={busy || recording}
                onPress={() => {
                  update({ mode });
                  setError('');
                }}
                style={[s.mode, project.mode === mode && { backgroundColor: colors.sage }]}
              >
                <Text style={ui.label}>
                  {mode === 'video' ? 'Clip' : mode === 'photos' ? 'Photos' : 'Sample'}
                </Text>
              </Pressable>
            ))}
          </View>
          {project.mode === 'photos' ? (
            <>
              <Text style={ui.body}>{guidance[Math.min(project.photos.length, 2)]}</Text>
              <Photo
                source={
                  project.photos.length
                    ? { uri: project.photos[Math.min(selectedPhoto, project.photos.length - 1)] }
                    : roomImage
                }
                height={220}
                label={
                  project.photos.length ? 'Your selected room reference' : 'Example photo framing'
                }
              />
              <View style={ui.between}>
                <Text style={ui.small}>
                  {project.photos.length
                    ? `${project.photos.length}/3 views · one is enough`
                    : 'Example framing'}
                </Text>
                {!!project.photos.length && (
                  <TextAction
                    label="Remove selected photo"
                    disabled={busy}
                    onPress={() => {
                      const previous = project.photos;
                      update({
                        photos: previous.filter(
                          (_, i) => i !== Math.min(selectedPhoto, previous.length - 1),
                        ),
                      });
                      setSelectedPhoto(0);
                      store.notify('Photo removed', () => update({ photos: previous }));
                    }}
                  >
                    Remove
                  </TextAction>
                )}
              </View>
              {!!project.photos.length && (
                <View style={s.thumbnails}>
                  {project.photos.map((uri, index) => (
                    <Pressable
                      key={uri + index}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${angles[index]}`}
                      onPress={() => setSelectedPhoto(index)}
                      style={[s.thumb, selectedPhoto === index && { borderColor: colors.forest }]}
                    >
                      <Image source={{ uri }} style={s.thumbImage} />
                      <Text style={ui.small}>{angles[index]}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {project.photos.length < 3 && (
                <View style={s.mediaActions}>
                  <Button
                    disabled={busy}
                    loading={busy}
                    onPress={() => {
                      void pick(true);
                    }}
                  >
                    Take photo
                  </Button>
                  <TextAction
                    disabled={busy}
                    onPress={() => {
                      void pick(false);
                    }}
                  >
                    Choose photos
                  </TextAction>
                </View>
              )}
              <Text style={ui.small}>Reference previews are saved only on this device.</Text>
            </>
          ) : project.mode === 'video' ? (
            <>
              <Text style={ui.body}>
                Pan slowly from the doorway to the window. Keep it under 15 seconds.
              </Text>
              {recording ? (
                <SilentRecorder
                  onCapture={(uri) => {
                    store.setClip(project.id, { uri, duration: 0 });
                    setRecording(false);
                    store.notify('Silent clip added');
                  }}
                  onCancel={() => setRecording(false)}
                />
              ) : clip ? (
                <>
                  <ClipPreview uri={clip.uri} />
                  <TextAction onPress={() => store.setClip(project.id, undefined)}>
                    Remove clip
                  </TextAction>
                </>
              ) : (
                <Photo
                  source={roomImage}
                  height={220}
                  label="Example room for a slow camera sweep"
                />
              )}
              {!recording && (
                <View style={s.mediaActions}>
                  {Platform.OS !== 'web' && (
                    <Button disabled={busy} onPress={() => setRecording(true)}>
                      {clip ? 'Record again' : 'Record clip'}
                    </Button>
                  )}
                  <Button
                    disabled={busy}
                    loading={busy}
                    secondary={Platform.OS !== 'web'}
                    onPress={() => {
                      void pick(false);
                    }}
                  >
                    Choose clip
                  </Button>
                </View>
              )}
              <Text style={ui.small}>
                Clips stay in this session. The styling plan saves separately.
              </Text>
            </>
          ) : (
            <>
              <Photo
                source={moods.find((m) => m.id === project.mood)!.image}
                height={260}
                label="Sample room"
              />
              <Text style={ui.body}>Try the complete flow with this sample room.</Text>
            </>
          )}
        </>
      ) : (
        <>
          <Text accessibilityRole="header" style={ui.title}>
            Set the mood.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            accessibilityRole="radiogroup"
            accessibilityLabel="Room style"
          >
            {moods.map((m) => (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityLabel={m.name}
                aria-checked={project.mood === m.id}
                onPress={() => update({ mood: m.id })}
                style={[s.mood, project.mood === m.id && { borderBottomColor: colors.forest }]}
              >
                <Image source={m.image} style={s.moodImage} />
                <Text style={[ui.label, { fontSize: 12, paddingVertical: 9 }]}>{m.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={s.field}>
            <Text style={ui.label}>Room name</Text>
            <TextInput
              accessibilityLabel="Room name"
              maxLength={40}
              value={project.name}
              onChangeText={(name) => update({ name })}
              style={s.input}
              placeholder="Bedroom, studio, your corner"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
            {!project.name.trim() && (
              <Text accessibilityRole="alert" style={s.error}>
                Give this room a name.
              </Text>
            )}
          </View>
          <View style={s.field}>
            <Text style={ui.label}>Budget · Rp</Text>
            <View
              style={s.budgets}
              accessibilityRole="radiogroup"
              accessibilityLabel="Budget presets"
            >
              {[250000, 500000, 1000000].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="radio"
                  accessibilityLabel={`Budget ${value} rupiah`}
                  aria-checked={project.budget === String(value)}
                  onPress={() => {
                    Keyboard.dismiss();
                    update({ budget: String(value) });
                  }}
                  style={[
                    s.preset,
                    project.budget === String(value) && { backgroundColor: colors.sage },
                  ]}
                >
                  <Text style={ui.label}>{value === 1000000 ? '1m' : `${value / 1000}k`}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              accessibilityLabel="Decoration budget in rupiah"
              value={project.budget}
              onChangeText={(budget) => update({ budget })}
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={9}
              style={s.input}
              returnKeyType="done"
            />
            {budget === null && (
              <Text accessibilityRole="alert" style={s.error}>
                Use whole rupiah from 50,000 to 100,000,000.
              </Text>
            )}
          </View>
          <Text style={ui.small}>Sample styling. Photos and clips are not analyzed.</Text>
        </>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
    </Page>
  );
}
const s = StyleSheet.create({
  steps: { flexDirection: 'row', gap: 18 },
  step: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.line,
  },
  stepActive: { borderBottomColor: colors.forest },
  modes: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.paper,
    padding: 4,
    borderRadius: 14,
  },
  mode: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  mediaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  thumbnails: { flexDirection: 'row', gap: 8 },
  thumb: { flex: 1, minWidth: 0, borderWidth: 2, borderColor: 'transparent', padding: 2, gap: 5 },
  thumbImage: { width: '100%', height: 65, borderRadius: 5 },
  mood: {
    width: 135,
    padding: 6,
    backgroundColor: colors.paper,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  moodImage: { width: '100%', height: 140 },
  field: { gap: 10 },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.paper,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.forest,
  },
  budgets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    borderRadius: 10,
  },
  error: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.error },
});
