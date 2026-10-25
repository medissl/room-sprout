import React from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { ProductRow } from '../components/ProductRow';
import { formatPrice, moods, picksWithinBudget } from '../data';
import { useRoom } from '../state';
import { colors, ui } from '../theme';

export default function Result() {
  const { mood, budget, rooms, saveRoom, ready } = useRoom();
  const concept = moods.find((item) => item.id === mood)!;
  const picks = picksWithinBudget(budget);
  const total = picks.reduce((sum, product) => sum + product.price, 0);
  const saved = rooms.some((room) => room.id === `${mood}-${budget}`);
  return (
    <Page
      back
      footer={
        <Button disabled={!ready} onPress={saved ? () => router.push('/studio/rooms') : saveRoom}>
          {saved ? 'View saved room' : 'Save room'}
        </Button>
      }
    >
      <Text accessibilityRole="header" style={ui.title}>
        {concept.name}
      </Text>
      <View style={{ gap: 12 }}>
        <Photo source={concept.image} height={365} label={`${concept.name} sample room concept`} />
        <View style={ui.between}>
          <Text style={ui.small}>Sample concept</Text>
          <TextAction onPress={() => router.push('/preferences')}>Change style</TextAction>
        </View>
        <View style={[ui.row, { gap: 10 }]}>
          {concept.palette.map((color) => (
            <View
              key={color}
              style={{ width: 27, height: 27, borderRadius: 14, backgroundColor: color }}
            />
          ))}
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <Text accessibilityRole="header" style={ui.heading}>
          The finishing touches.
        </Text>
        <View>
          {picks.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </View>
        {!picks.length && (
          <Text style={ui.body}>Start with a rearrange. Save for one piece you love.</Text>
        )}
        <View style={[ui.between, { paddingTop: 8 }]}>
          <Text style={ui.label}>Estimated total</Text>
          <Text style={ui.heading}>{formatPrice(total)}</Text>
        </View>
        <Text style={ui.small}>Budget {formatPrice(budget)}. Shipping extra.</Text>
      </View>
      <Text style={[ui.small, { color: colors.muted }]}>
        Sample makeover. Your photos haven’t been analyzed.
      </Text>
    </Page>
  );
}
