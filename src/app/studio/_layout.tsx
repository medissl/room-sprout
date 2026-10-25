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
          <View style={s.row} accessibilityRole="tablist">
            {[
              { route: 'index', name: 'Discover' },
              { route: 'rooms', name: 'My rooms' },
              { route: 'finds', name: 'Finds' },
            ].map((item) => {
              const active = state.routes[state.index].name === item.route;
              return (
                <Pressable
                  key={item.route}
                  accessibilityRole="tab"
                  accessibilityLabel={item.name}
                  aria-selected={active}
                  style={({ pressed }) => [
                    s.item,
                    active && s.activeItem,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
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
  bar: { backgroundColor: colors.cream, paddingHorizontal: 18, paddingTop: 9, paddingBottom: 12 },
  row: {
    flexDirection: 'row',
    padding: 6,
    gap: 3,
    backgroundColor: colors.forest,
    borderRadius: 23,
  },
  item: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  activeItem: { backgroundColor: colors.cream },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.paper },
  active: { color: colors.forest, fontFamily: fonts.bold },
});
