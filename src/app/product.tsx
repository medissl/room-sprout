import React, { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { formatPrice, marketplaceUrl, products } from '../data';
import { useRoom } from '../state';
import { colors, ui } from '../theme';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((product) => product.id === id);
  const { favorites, toggleFavorite, ready } = useRoom();
  const [error, setError] = useState('');
  if (!product)
    return (
      <Page back>
        <Text style={ui.title}>Find not available.</Text>
      </Page>
    );
  const saved = favorites.includes(product.id);
  async function open(market: 'shopee' | 'tokopedia') {
    setError('');
    try {
      await Linking.openURL(marketplaceUrl(market, product!.query));
    } catch {
      setError('Couldn’t open the store. Please try again.');
    }
  }
  return (
    <Page back>
      <Text accessibilityRole="header" style={ui.title}>
        {product.type}
      </Text>
      <Photo source={product.image} height={330} label={`${product.type} concept photo`} />
      <View style={ui.between}>
        <Text style={ui.small}>Estimated price</Text>
        <Text style={ui.heading}>{formatPrice(product.price)}</Text>
      </View>
      <Text style={ui.body}>{product.why}</Text>
      <View style={{ gap: 10 }}>
        <Button onPress={() => open('shopee')}>Search similar on Shopee</Button>
        <Button secondary onPress={() => open('tokopedia')}>
          Search similar on Tokopedia
        </Button>
        {ready && (
          <TextAction selected={saved} onPress={() => toggleFavorite(product.id)}>
            {saved ? 'Saved to your finds' : 'Save this find'}
          </TextAction>
        )}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={[ui.body, { color: colors.error }]}>
          {error}
        </Text>
      ) : null}
      <Text style={ui.small}>Concept photo. Store results, prices, and sizes may differ.</Text>
    </Page>
  );
}
