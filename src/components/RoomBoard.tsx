import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { moods, type MoodId } from '../data';
import { colors, fonts } from '../theme';

// The composition stays proportional to its container on both phones and the web preview.
export function RoomBoard({ mood, onOpen }: { mood: MoodId; onOpen: () => void }) {
  const room = moods.find((item) => item.id === mood)!;
  return (
    <View style={s.board}>
      <View style={[s.paper, { backgroundColor: room.palette[0] }]} pointerEvents="none" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Explore ${room.name} sample concept`}
        onPress={onOpen}
        style={({ pressed }) => [s.snapshot, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Image source={room.image} style={s.room} accessibilityLabel={`${room.name} inspiration`} />
        <View style={s.caption}>
          <Text style={s.name}>{room.name}</Text>
          <Text style={s.sample}>Sample</Text>
        </View>
      </Pressable>
      <View pointerEvents="none" style={s.tape} />
      <View accessible accessibilityLabel={`Material palette for ${room.name}`} style={s.swatches}>
        {room.palette.map((color, index) => (
          <View key={color} style={[s.swatch, { backgroundColor: color, top: index * 23 }]} />
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View Pleated bedside lamp"
        onPress={() => router.push({ pathname: '/product', params: { id: 'lamp' } })}
        style={({ pressed }) => [
          s.lamp,
          { transform: [{ rotate: '6deg' }, { scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Image
          source={require('../../assets/lamp-cutout.png')}
          style={s.cutout}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  board: { width: '100%', aspectRatio: 1.07, marginVertical: 4 },
  paper: {
    position: 'absolute',
    right: 0,
    top: '8%',
    width: '69%',
    height: '79%',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 8,
    transform: [{ rotate: '7deg' }],
    opacity: 0.45,
  },
  snapshot: {
    position: 'absolute',
    left: '2%',
    top: '6%',
    width: '72%',
    height: '86%',
    backgroundColor: colors.paper,
    padding: 7,
    paddingBottom: 0,
    transform: [{ rotate: '-7deg' }],
    boxShadow: '0px 8px 18px rgba(67, 49, 26, 0.12)',
  },
  room: { width: '100%', flex: 1, resizeMode: 'cover' },
  caption: {
    height: 43,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 1,
  },
  name: { fontFamily: fonts.bold, fontSize: 12, color: colors.forest },
  sample: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  tape: {
    position: 'absolute',
    top: '2%',
    left: '24%',
    width: '26%',
    height: 23,
    backgroundColor: 'rgba(195, 175, 137, 0.55)',
    transform: [{ rotate: '-4deg' }],
  },
  swatches: {
    position: 'absolute',
    right: '5%',
    top: '5%',
    width: 59,
    height: 90,
    transform: [{ rotate: '12deg' }],
  },
  swatch: {
    position: 'absolute',
    width: 57,
    height: 35,
    borderWidth: 4,
    borderColor: colors.paper,
  },
  lamp: { position: 'absolute', right: '-1%', bottom: '0%', width: '44%', height: '69%' },
  cutout: { width: '100%', height: '100%' },
});
