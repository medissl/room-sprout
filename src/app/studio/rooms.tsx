import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../../components/ui';
import { formatPrice, moods } from '../../data';
import { useRoom } from '../../state';
import { ui } from '../../theme';

export default function Rooms() {
  const { rooms, removeRoom, setMood, setBudget, ready } = useRoom();
  return (
    <Page>
      <Text accessibilityRole="header" style={ui.title}>
        My rooms.
      </Text>
      {!ready ? (
        <Text accessibilityRole="status" style={ui.body}>
          Loading…
        </Text>
      ) : !rooms.length ? (
        <View style={{ gap: 22, paddingVertical: 70 }}>
          <Text style={ui.heading}>Nothing saved yet.</Text>
          <Button onPress={() => router.push('/capture')}>Start a room</Button>
        </View>
      ) : (
        rooms.map((room) => (
          <View key={room.id} style={{ gap: 10 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${room.name} concept`}
              onPress={() => {
                setMood(room.mood);
                setBudget(room.budget);
                router.push('/result');
              }}
            >
              <Photo
                source={moods.find((mood) => mood.id === room.mood)!.image}
                height={285}
                label={`${room.name} saved concept`}
              />
            </Pressable>
            <View style={ui.between}>
              <View style={{ gap: 4 }}>
                <Text style={ui.label}>{room.name}</Text>
                <Text style={ui.small}>{formatPrice(room.budget)} budget</Text>
              </View>
              <TextAction label={`Remove ${room.name} concept`} onPress={() => removeRoom(room.id)}>
                Remove
              </TextAction>
            </View>
          </View>
        ))
      )}
      <Text style={ui.small}>Saved on this device.</Text>
    </Page>
  );
}
