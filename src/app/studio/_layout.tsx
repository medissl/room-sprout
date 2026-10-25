import React from 'react';
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';

export default function StudioLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state }) => (
        <SafeAreaView edges={['bottom']} style={s.bar}>
          <View style={s.row}>
            {[
              { route: 'index', name: 'Discover' },
              { route: 'rooms', name: 'My rooms' },
              { route: 'finds', name: 'Finds' },
            ].map((item) => {
              const active = state.routes[state.index].name === item.route;
              return (
                <Pressable
                  key={item.route}
                  accessibilityRole="button"
                  accessibilityLabel={item.name}
                  accessibilityState={{ selected: active }}
                  style={s.item}
                  onPress={() =>
                    router.navigate(
                      item.route === 'index'
                        ? '/studio'
                        : item.route === 'rooms'
                          ? '/studio/rooms'
                          : '/studio/finds',
                    )
                  }
                >
                  <Text style={[s.label, active && s.active]}>{item.name}</Text>
                  {active && <View style={s.activeLine} />}
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rooms" />
      <Tabs.Screen name="finds" />
    </Tabs>
  );
}
const s = StyleSheet.create({
  bar: { backgroundColor: colors.cream, borderTopWidth: 1, borderTopColor: colors.line },
  row: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 7 },
  item: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  active: { color: colors.forest, fontFamily: fonts.medium },
  activeLine: {
    position: 'absolute',
    bottom: 2,
    width: 34,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.forest,
  },
});
