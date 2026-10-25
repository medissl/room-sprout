import React from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { RoomProvider } from '../state';
import { colors } from '../theme';

export default function Layout() {
  const [loaded, error] = useFonts({
    DMRegular: require('@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
    DMMedium: require('@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
    DMBold: require('@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf'),
  });
  const path = usePathname();
  const viewport = useWindowDimensions();
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.cream,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.forest }}>Loading RoomSprout…</Text>
      </View>
    );
  const framed = Platform.OS === 'web' && path !== '/';
  return (
    <RoomProvider>
      <Head>
        <title>RoomSprout · Your room. More you.</title>
        <meta
          name="description"
          content="Thoughtful room makeovers, a style that feels like you, and little decor finds. Explore the RoomSprout prototype."
        />
        <meta name="theme-color" content="#F5F1E7" />
      </Head>
      <StatusBar style="dark" />
      <View style={[s.root, framed && s.canvas]}>
        <View
          style={[
            s.stack,
            framed && s.frame,
            framed &&
              viewport.width >= 700 && {
                maxWidth: Math.min(460, Math.max(320, Math.round(viewport.height * 0.49))),
              },
          ]}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.cream },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="studio" />
            <Stack.Screen name="capture" />
            <Stack.Screen name="preferences" />
            <Stack.Screen name="result" />
            <Stack.Screen name="product" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </View>
    </RoomProvider>
  );
}
const s = StyleSheet.create({
  root: { flex: 1 },
  canvas: { backgroundColor: '#E6E9DF', alignItems: 'center' },
  stack: { flex: 1, width: '100%' },
  frame: {
    maxWidth: 460,
    backgroundColor: colors.cream,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D1D8C9',
  },
});
