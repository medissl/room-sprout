import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TextAction } from './ui';
import { type Product, formatPrice } from '../data';
import { useRoom } from '../state';
import { colors, ui } from '../theme';

export function ProductRow({ product }: { product: Product }) {
  const { favorites, toggleFavorite, ready } = useRoom();
  const saved = favorites.includes(product.id);
  return (
    <View style={s.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.type}`}
        onPress={() => router.push({ pathname: '/product', params: { id: product.id } })}
        style={s.main}
      >
        <Image
          source={product.image}
          accessibilityLabel={`${product.type} concept photo`}
          style={s.thumbnail}
        />
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={ui.label}>{product.type}</Text>
          <Text style={ui.small}>Est. {formatPrice(product.price)}</Text>
        </View>
      </Pressable>
      <TextAction
        label={saved ? `Unsave ${product.type}` : `Save ${product.type}`}
        selected={saved}
        onPress={() => {
          if (ready) toggleFavorite(product.id);
        }}
      >
        {saved ? 'Saved' : 'Save'}
      </TextAction>
    </View>
  );
}
const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  main: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  thumbnail: { width: 70, height: 78, borderRadius: 9 },
});
