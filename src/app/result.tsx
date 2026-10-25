import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { ClipPreview } from '../components/ClipPreview';
import { formatPrice, moods, parseBudget, picksWithinBudget, products } from '../data';
import { itemTotal, planReady, validMood, type Project } from '../model';
import { useRoom } from '../state';
import { colors, fonts, ui } from '../theme';

export default function Result() {
  const { id, sample, from } = useLocalSearchParams<{
    id?: string;
    sample?: string;
    from?: string;
  }>();
  const store = useRoom();
  const example = useMemo<Project | undefined>(
    () =>
      validMood(sample)
        ? {
            id: 'example',
            name: moods.find((m) => m.id === sample)!.name,
            mood: sample,
            budget: '500000',
            items: picksWithinBudget(500000).map((p) => p.id),
            photos: [],
            mode: 'sample',
            stage: 'plan',
            prepared: true,
            updatedAt: 0,
          }
        : undefined,
    [sample],
  );
  const project = store.projects.find((p) => p.id === id) || example;
  const [settings, setSettings] = useState(false);
  const [view, setView] = useState<'style' | 'room'>('style');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const close = async () => {
    await store.flush();
    router.dismissTo(from === 'discover' || example ? '/studio' : '/studio/rooms');
  };
  if (!project)
    return (
      <Page
        title="Room plan"
        onClose={() => {
          void close();
        }}
      >
        <Text style={ui.title}>Room not available.</Text>
        <Button onPress={() => router.replace('/studio/rooms')}>View my rooms</Button>
      </Page>
    );
  const room = project;
  const concept = moods.find((m) => m.id === room.mood)!;
  const budget = parseBudget(room.budget);
  const total = itemTotal(room.items);
  const over = budget !== null && total > budget;
  const update = (patch: Partial<Omit<Project, 'id'>>) => store.updateRoom(room.id, patch);
  const changeReference = () =>
    router.push({
      pathname: '/capture',
      params: { id: room.id, step: 'room', from: from || 'rooms', returnTo: 'plan' },
    });
  async function finish() {
    if (example) {
      const created = store.createRoom(room.mood);
      if (!created) return;
      store.updateRoom(created.id, { mode: 'sample', stage: 'style' });
      router.replace({
        pathname: '/capture',
        params: { id: created.id, step: 'style', from: 'discover' },
      });
      return;
    }
    if (!planReady(room)) return;
    setFinishing(true);
    const saved = await store.flush();
    setFinishing(false);
    if (saved) {
      store.notify(`${room.name} is ready`);
      router.dismissTo('/studio/rooms');
    }
  }
  const tips = {
    earthy: 'Keep the big pieces. Add soft light and one green layer.',
    cozy: 'Give one corner a purpose. Start with warm light and soft texture.',
    natural: 'Leave breathing room. Let one organic shape do the work.',
  };
  return (
    <Page
      title={example ? 'Sample plan' : 'Your room plan'}
      onClose={() => {
        void close();
      }}
      footer={
        <>
          <View style={ui.between}>
            <View>
              <Text style={ui.small}>Estimated total</Text>
              <Text style={ui.heading}>{formatPrice(total)}</Text>
            </View>
            <Text style={[ui.small, over && { color: colors.error }]}>
              {budget === null
                ? 'Set a budget'
                : over
                  ? `${formatPrice(total - budget)} over budget`
                  : `${formatPrice(budget)} budget`}
            </Text>
          </View>
          <Button
            loading={finishing}
            disabled={!store.ready || (!example && !planReady(room))}
            onPress={() => {
              void finish();
            }}
          >
            {example ? 'Use this style' : 'Done'}
          </Button>
          {!example && (
            <Text style={[ui.small, { textAlign: 'center' }]}>
              {store.status === 'saving'
                ? 'Saving changes…'
                : store.status === 'error'
                  ? 'Changes kept in this session'
                  : 'Saved automatically on this device'}
            </Text>
          )}
        </>
      }
    >
      <View style={[ui.between, { alignItems: 'flex-start', gap: 10 }]}>
        <Text accessibilityRole="header" style={[ui.title, { flex: 1 }]}>
          {room.name || 'My room'}
        </Text>
        {!example && (
          <TextAction selected={settings} onPress={() => setSettings(!settings)}>
            {settings ? 'Hide settings' : 'Edit room'}
          </TextAction>
        )}
      </View>
      {settings && (
        <View style={s.settings}>
          <Text style={ui.label}>Room name</Text>
          <TextInput
            accessibilityLabel="Room name"
            value={room.name}
            onChangeText={(name) => update({ name })}
            maxLength={40}
            style={s.input}
          />
          {!room.name.trim() && (
            <Text accessibilityRole="alert" style={s.error}>
              Give your room a name.
            </Text>
          )}
          <View accessibilityRole="radiogroup" accessibilityLabel="Room style" style={{ gap: 6 }}>
            {moods.map((m) => (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityLabel={m.name}
                aria-checked={room.mood === m.id}
                onPress={() => update({ mood: m.id })}
                style={[s.styleOption, room.mood === m.id && { backgroundColor: colors.sage }]}
              >
                <View style={{ width: 22, height: 24, backgroundColor: m.palette[0] }} />
                <Text style={ui.label}>{m.name}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={ui.label}>Budget · Rp</Text>
          <TextInput
            accessibilityLabel="Decoration budget in rupiah"
            value={room.budget}
            onChangeText={(value) => update({ budget: value })}
            maxLength={9}
            keyboardType="number-pad"
            inputMode="numeric"
            style={s.input}
          />
          {budget === null && (
            <Text accessibilityRole="alert" style={s.error}>
              Use whole rupiah from 50,000 to 100,000,000.
            </Text>
          )}
        </View>
      )}
      {room.mode !== 'sample' && (
        <View accessibilityRole="tablist" style={s.views}>
          {(['style', 'room'] as const).map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityLabel={tab === 'style' ? 'Style reference' : 'Your room'}
              aria-selected={view === tab}
              onPress={() => setView(tab)}
              style={[s.view, view === tab && { borderBottomColor: colors.forest }]}
            >
              <Text style={ui.label}>{tab === 'style' ? 'Style reference' : 'Your room'}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {view === 'style' || room.mode === 'sample' ? (
        <>
          <Photo source={concept.image} height={280} label={`${concept.name} style reference`} />
          <View style={ui.between}>
            <Text style={ui.small}>Sample styling · {concept.name}</Text>
            <View style={[ui.row, { gap: 4 }]}>
              {concept.palette.map((color) => (
                <View key={color} style={{ width: 14, height: 19, backgroundColor: color }} />
              ))}
            </View>
          </View>
          <Text style={ui.body}>{tips[room.mood]}</Text>
        </>
      ) : room.mode === 'photos' && room.photos.length ? (
        <>
          <Photo
            source={{ uri: room.photos[Math.min(photoIndex, room.photos.length - 1)] }}
            height={280}
            label="Your saved room reference"
          />
          <View style={s.photos}>
            {room.photos.map((uri, index) => (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={`Show room photo ${index + 1}`}
                onPress={() => setPhotoIndex(index)}
                style={{ flex: 1, minHeight: 60 }}
              >
                <Image source={{ uri }} style={s.thumbnail} />
              </Pressable>
            ))}
          </View>
          <Text style={ui.small}>Your reference photos. No AI analysis has run.</Text>
        </>
      ) : room.mode === 'video' && store.clips[room.id] ? (
        <ClipPreview uri={store.clips[room.id].uri} />
      ) : (
        <View style={{ gap: 12 }}>
          <Text style={ui.body}>
            {room.mode === 'video'
              ? 'Your clip was kept in its original session.'
              : 'No reference photos yet.'}
          </Text>
          <Button secondary onPress={changeReference}>
            Add a room reference
          </Button>
        </View>
      )}
      {!example && (room.mode === 'sample' || room.photos.length > 0 || store.clips[room.id]) && (
        <TextAction onPress={changeReference}>
          {room.mode === 'sample' ? 'Add my room reference' : 'Change room reference'}
        </TextAction>
      )}
      <View style={{ gap: 12 }}>
        <Text accessibilityRole="header" style={ui.heading}>
          {example ? 'The finishing touches' : 'Make it your mix'}
        </Text>
        <Text style={ui.small}>
          {example
            ? 'Concept pieces. Estimated prices.'
            : 'Choose your pieces. Prices are estimates; shipping is extra.'}
        </Text>
        {over && (
          <View style={{ gap: 8 }}>
            <Text accessibilityRole="alert" style={s.error}>
              Your mix is {formatPrice(total - budget!)} over budget. Remove a piece or edit your
              budget.
            </Text>
            <TextAction
              onPress={() => {
                const previous = room.items;
                update({ items: picksWithinBudget(budget!).map((p) => p.id) });
                store.notify('Mix adjusted', () => update({ items: previous }));
              }}
            >
              Suggest within budget
            </TextAction>
          </View>
        )}
        {products.map((product) => {
          const selected = room.items.includes(product.id);
          const unavailable = !selected && budget !== null && total + product.price > budget;
          return (
            <View key={product.id} style={s.product}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View ${product.type}`}
                onPress={() =>
                  router.push({
                    pathname: '/product',
                    params: { id: product.id, ...(!example ? { room: room.id } : {}) },
                  })
                }
                style={s.productInfo}
              >
                <Image source={product.image} style={s.productImage} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={ui.label}>{product.type}</Text>
                  <Text style={ui.small}>{formatPrice(product.price)}</Text>
                </View>
              </Pressable>
              {example ? (
                <Text style={ui.small}>{selected ? 'In this mix' : ''}</Text>
              ) : (
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Include ${product.type}`}
                  aria-checked={selected}
                  aria-disabled={unavailable}
                  disabled={unavailable}
                  onPress={() => {
                    const previous = room.items;
                    update({
                      items: selected
                        ? previous.filter((item) => item !== product.id)
                        : [...previous, product.id],
                    });
                    store.notify(
                      selected ? 'Piece removed' : 'Piece added',
                      selected
                        ? () =>
                            store.updateRoom(room.id, (latest) => ({
                              items: [...new Set([...latest.items, product.id])],
                            }))
                        : undefined,
                    );
                  }}
                  style={[
                    s.include,
                    selected && { backgroundColor: colors.sage },
                    unavailable && { opacity: 0.5 },
                  ]}
                >
                  <Text style={[ui.label, { fontSize: 12 }]}>
                    {selected ? 'Remove' : unavailable ? 'Over budget' : 'Add'}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </Page>
  );
}
const s = StyleSheet.create({
  settings: { gap: 12, padding: 14, backgroundColor: colors.pale, borderRadius: 14 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.forest,
    backgroundColor: colors.paper,
  },
  error: { fontFamily: fonts.regular, color: colors.error, fontSize: 13, lineHeight: 19 },
  styleOption: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 9,
    borderRadius: 8,
  },
  views: { flexDirection: 'row', gap: 20 },
  view: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  photos: { flexDirection: 'row', gap: 10 },
  thumbnail: { width: '100%', height: 65, borderRadius: 6 },
  product: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  productInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  productImage: { width: 58, height: 65, borderRadius: 7 },
  include: {
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderRadius: 10,
  },
});
