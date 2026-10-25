import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button, Logo } from '../../components/ui';
import { Materials } from '../../components/Materials';
import { moods, roomImage } from '../../data';
import { colors, fonts, ui } from '../../theme';
import { useRoom } from '../../state';

export default function Discover() {
  const { setMood } = useRoom();
  const { width, height } = useWindowDimensions();
  const heroHeight = Math.min(565, Math.max(390, height - 280));
  function openRoom() {
    setMood('earthy');
    router.push('/result');
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
      <View style={s.header}>
        <Logo />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.canvas, { height: heroHeight }]}>
          <Image
            source={roomImage}
            style={s.photo}
            accessibilityLabel="Sage and cream bedroom with walnut furniture"
          />
          <LinearGradient
            colors={['transparent', 'rgba(27,34,22,.72)']}
            style={s.fade}
            pointerEvents="none"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View Pleated bedside lamp"
            onPress={() => router.push({ pathname: '/product', params: { id: 'lamp' } })}
            style={[s.touchpoint, { left: '31%', top: '35%' }]}
          >
            <View style={s.dot}>
              <Text style={s.number}>1</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View Sage cotton throw"
            onPress={() => router.push({ pathname: '/product', params: { id: 'throw' } })}
            style={[s.touchpoint, { right: '14%', top: '61%' }]}
          >
            <View style={s.dot}>
              <Text style={s.number}>2</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore the earthy room concept"
            onPress={openRoom}
            style={s.roomTitle}
          >
            <Text accessibilityRole="header" style={[s.title, { fontSize: width < 350 ? 45 : 52 }]}>
              The soft reset
            </Text>
          </Pressable>
        </View>
        <View style={s.palette}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose material palette"
            onPress={() => router.push('/preferences')}
          >
            <Materials size={width < 350 ? 46 : 58} />
          </Pressable>
          <View style={s.action}>
            <Text style={s.mood}>Earthy & easy</Text>
            <Button onPress={() => router.push('/capture')}>Style my room</Button>
          </View>
        </View>
        <Text style={s.sample}>Sample room</Text>
        <View style={s.more}>
          <Text accessibilityRole="header" style={ui.heading}>
            A different feeling.
          </Text>
          <View style={s.moods}>
            {moods.slice(1).map((mood) => (
              <Pressable
                key={mood.id}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${mood.name}`}
                onPress={() => {
                  setMood(mood.id);
                  router.push('/preferences');
                }}
                style={{ flex: 1 }}
              >
                <Image source={mood.image} style={s.moodPhoto} />
                <Text style={[ui.label, { marginTop: 10 }]}>{mood.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  header: { height: 60, alignItems: 'center', justifyContent: 'center' },
  canvas: {
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: colors.sand,
  },
  photo: { position: 'absolute', width: '100%', height: '100%' },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180 },
  touchpoint: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    backgroundColor: colors.cream,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFFAA',
  },
  number: { fontFamily: fonts.medium, color: colors.forest, fontSize: 15 },
  roomTitle: {
    position: 'absolute',
    bottom: 23,
    left: 24,
    right: 12,
    minHeight: 58,
    justifyContent: 'center',
  },
  title: { color: colors.paper, fontFamily: fonts.display, lineHeight: 58, letterSpacing: -1.4 },
  palette: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  action: { flex: 1, gap: 8 },
  mood: { fontFamily: fonts.display, fontSize: 23, color: colors.ink },
  sample: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    paddingHorizontal: 24,
    marginTop: 9,
  },
  more: { padding: 24, paddingTop: 35, gap: 18 },
  moods: { flexDirection: 'row', gap: 15 },
  moodPhoto: { width: '100%', height: 180, borderRadius: 12 },
});
