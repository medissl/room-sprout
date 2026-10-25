import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Page } from '../components/ui';
import { formatPrice, moods, parseBudget } from '../data';
import { useRoom } from '../state';
import { colors, fonts, ui } from '../theme';

export default function Preferences() {
  const { mood, setMood, budget, setBudget } = useRoom();
  const [input, setInput] = useState(String(budget));
  const validBudget = parseBudget(input);
  return (
    <Page
      back
      footer={
        <Button
          disabled={validBudget === null}
          onPress={() => {
            if (validBudget !== null) {
              setBudget(validBudget);
              router.push('/result');
            }
          }}
        >
          See my concept
        </Button>
      }
    >
      <Text accessibilityRole="header" style={ui.title}>
        Set the mood.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {moods.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="radio"
            accessibilityLabel={item.name}
            aria-checked={mood === item.id}
            onPress={() => setMood(item.id)}
            style={[s.mood, mood === item.id && s.selected]}
          >
            <Image source={item.image} style={s.image} />
            <View style={{ paddingVertical: 12, gap: 6 }}>
              <Text style={ui.label}>{item.name}</Text>
              {mood === item.id && (
                <Text style={[ui.small, { color: colors.forest }]}>Selected</Text>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ gap: 14 }}>
        <Text accessibilityRole="header" style={ui.heading}>
          Your budget
        </Text>
        <View style={[ui.row, { gap: 8, flexWrap: 'wrap' }]}>
          {[250000, 500000, 1000000].map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: Number(input) === value }}
              onPress={() => setInput(String(value))}
              style={[s.budget, Number(input) === value && { borderBottomColor: colors.forest }]}
            >
              <Text style={ui.label}>{formatPrice(value)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={s.inputRow}>
          <Text style={ui.label}>Rp</Text>
          <TextInput
            accessibilityLabel="Decoration budget in rupiah"
            keyboardType="number-pad"
            inputMode="numeric"
            value={input}
            maxLength={9}
            onChangeText={setInput}
            style={s.input}
            placeholder="500000"
            placeholderTextColor={colors.muted}
          />
        </View>
        {validBudget === null && (
          <Text accessibilityRole="alert" style={[ui.small, { color: colors.error }]}>
            Enter Rp50,000 to Rp100,000,000 in whole rupiah.
          </Text>
        )}
      </View>
      <Text style={ui.small}>Sample concepts. AI photo analysis comes later.</Text>
    </Page>
  );
}
const s = StyleSheet.create({
  mood: {
    width: 222,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    padding: 7,
    backgroundColor: colors.paper,
  },
  selected: { borderBottomColor: colors.forest },
  image: { width: '100%', height: 246, borderRadius: 2 },
  budget: {
    paddingHorizontal: 6,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.line,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontFamily: fonts.medium,
    color: colors.ink,
    fontSize: 18,
    paddingHorizontal: 4,
  },
});
