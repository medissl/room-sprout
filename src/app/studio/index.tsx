import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, Logo, TextAction } from '../../components/ui';
import { RoomBoard } from '../../components/RoomBoard';
import { moods } from '../../data';
import { colors, fonts } from '../../theme';
import { useRoom } from '../../state';

export default function Discover() {
  const { mood, setMood } = useRoom();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
      <View style={s.header}>
        <Logo small />
        <TextAction onPress={() => router.push('/studio/rooms')}>My rooms</TextAction>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text accessibilityRole="header" style={s.title}>
          Make room{'\n'}for you.
        </Text>
        <RoomBoard mood={mood} onOpen={() => router.push('/result')} />
        <Button onPress={() => router.push('/capture')}>Style my room</Button>
        <View style={s.feeling}>
          <Text accessibilityRole="header" style={s.heading}>
            Find your feeling
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.moods}
          >
            {moods.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityLabel={item.name}
                aria-checked={mood === item.id}
                onPress={() => setMood(item.id)}
                style={({ pressed }) => [
                  s.mood,
                  mood === item.id && s.selected,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <View style={[s.sample, { backgroundColor: item.palette[0] }]} />
                <Text style={[s.moodName, mood === item.id && { fontFamily: fonts.bold }]}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 26, gap: 15 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 47,
    lineHeight: 45,
    letterSpacing: -2.7,
    color: colors.forest,
  },
  feeling: { marginTop: 7, gap: 9 },
  heading: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: -0.5, color: colors.forest },
  moods: { gap: 18 },
  mood: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selected: { borderBottomColor: colors.forest },
  sample: { width: 17, height: 21, transform: [{ rotate: '-9deg' }] },
  moodName: { fontFamily: fonts.regular, fontSize: 13, color: colors.forest },
});
