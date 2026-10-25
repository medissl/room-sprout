import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../../components/ui';
import { formatPrice, moods } from '../../data';
import { itemTotal } from '../../model';
import { useRoom } from '../../state';
import { colors, ui } from '../../theme';
export default function Rooms() {
  const store = useRoom();
  function start() {
    const room = store.createRoom();
    if (room) router.push({ pathname: '/capture', params: { id: room.id, from: 'rooms' } });
  }
  return (
    <Page>
      <View style={ui.between}>
        <Text accessibilityRole="header" style={ui.title}>
          My rooms.
        </Text>
        {!!store.projects.length && <TextAction onPress={start}>New room</TextAction>}
      </View>
      {!store.ready ? (
        <Text accessibilityRole="status" style={ui.body}>
          Loading your rooms…
        </Text>
      ) : !store.projects.length ? (
        <View style={{ gap: 20, paddingTop: 20 }}>
          <Photo source={moods[0].image} height={240} label="A sample room to start with" />
          <Text style={ui.heading}>A little space for your ideas.</Text>
          <Button onPress={start}>Start a room</Button>
        </View>
      ) : (
        [...store.projects]
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .map((room) => (
            <View key={room.id} style={{ gap: 8 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${room.name || 'My room'}`}
                onPress={() =>
                  router.push({
                    pathname: room.stage === 'plan' ? '/result' : '/capture',
                    params: { id: room.id, step: room.stage, from: 'rooms' },
                  })
                }
              >
                <Photo
                  source={moods.find((m) => m.id === room.mood)!.image}
                  height={220}
                  label={`${room.name} styling plan`}
                />
              </Pressable>
              <View style={ui.between}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={ui.label}>{room.name || 'My room'}</Text>
                  <Text style={ui.small}>
                    {room.stage === 'plan'
                      ? `${room.items.length} pieces · ${formatPrice(itemTotal(room.items))} estimated`
                      : room.stage === 'style'
                        ? 'Draft · choose your style'
                        : 'Draft · add a room reference'}
                  </Text>
                </View>
                <TextAction
                  label={`Remove ${room.name || 'My room'}`}
                  onPress={() => store.removeRoom(room.id)}
                >
                  Remove
                </TextAction>
              </View>
            </View>
          ))
      )}
      {!!store.projects.length && (
        <Text style={[ui.small, { color: colors.muted }]}>
          Rooms and photo previews stay on this device.
        </Text>
      )}
    </Page>
  );
}
