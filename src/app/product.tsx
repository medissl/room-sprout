import React, { useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Page, Photo, TextAction } from '../components/ui';
import { formatPrice, marketplaceUrl, parseBudget, products } from '../data';
import { itemTotal } from '../model';
import { useRoom } from '../state';
import { colors, fonts, ui } from '../theme';
export default function ProductDetail() {
  const { id, room } = useLocalSearchParams<{ id: string; room?: string }>();
  const product = products.find((p) => p.id === id);
  const store = useRoom();
  const [error, setError] = useState('');
  const close = () => (router.canGoBack() ? router.back() : router.replace('/studio/finds'));
  if (!product)
    return (
      <Page title="Find" onClose={close}>
        <Text accessibilityRole="header" style={ui.title}>
          That find isn’t available.
        </Text>
        <Button onPress={() => router.replace('/studio/finds')}>Explore finds</Button>
      </Page>
    );
  const saved = store.favorites.includes(product.id);
  const project = store.projects.find((p) => p.id === room);
  const included = !!project?.items.includes(product.id);
  const budget = project ? parseBudget(project.budget) : null;
  const tooMuch =
    !!project && !included && budget !== null && itemTotal(project.items) + product.price > budget;
  async function open(market: 'shopee' | 'tokopedia') {
    setError('');
    try {
      await Linking.openURL(marketplaceUrl(market, product!.query));
    } catch {
      setError('The store could not open. Try again.');
    }
  }
  return (
    <Page
      title="Decor find"
      onClose={close}
      footer={
        project ? (
          <Button
            disabled={tooMuch || !store.ready}
            onPress={() => {
              const before = project.items;
              store.updateRoom(project.id, {
                items: included ? before.filter((i) => i !== product.id) : [...before, product.id],
              });
              store.notify(
                included ? 'Piece removed' : 'Added to your room',
                included
                  ? () =>
                      store.updateRoom(project.id, (latest) => ({
                        items: [...new Set([...latest.items, product.id])],
                      }))
                  : undefined,
              );
              close();
            }}
          >
            {included ? 'Remove from room' : tooMuch ? 'Above remaining budget' : 'Add to room'}
          </Button>
        ) : undefined
      }
    >
      <Text accessibilityRole="header" style={ui.title}>
        {product.type}
      </Text>
      <Photo source={product.image} height={285} label={`${product.type} concept photo`} />
      <View style={ui.between}>
        <View>
          <Text style={ui.small}>Estimated price</Text>
          <Text style={ui.heading}>{formatPrice(product.price)}</Text>
        </View>
        <TextAction
          selected={saved}
          disabled={!store.ready}
          label={saved ? 'Unsave this find' : 'Save this find'}
          onPress={() => {
            if (store.ready) store.toggleFavorite(product.id);
          }}
        >
          {saved ? 'Saved' : 'Save find'}
        </TextAction>
      </View>
      <Text style={ui.body}>{product.why}</Text>
      {tooMuch && (
        <Text style={[ui.small, { color: colors.error }]}>
          Remove another piece or edit your room budget first.
        </Text>
      )}
      <View style={{ gap: 10 }}>
        {(['shopee', 'tokopedia'] as const).map((market) => {
          const label = `Search similar on ${market === 'shopee' ? 'Shopee' : 'Tokopedia'}`;
          return Platform.OS === 'web' ? (
            <Link
              key={market}
              href={marketplaceUrl(market, product.query)}
              target="_blank"
              rel="noopener noreferrer"
              style={[styles.storeLink, market === 'tokopedia' && styles.secondaryLink]}
            >
              {label}
            </Link>
          ) : (
            <Button
              key={market}
              secondary={market === 'tokopedia'}
              onPress={() => {
                void open(market);
              }}
            >
              {label}
            </Button>
          );
        })}
      </View>
      {!!error && (
        <Text accessibilityRole="alert" style={[ui.body, { color: colors.error }]}>
          {error}
        </Text>
      )}
      <Text style={ui.small}>Concept photo. Store prices, sizes, and results may differ.</Text>
    </Page>
  );
}
const styles = StyleSheet.create({
  storeLink: {
    minHeight: 54,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: colors.forest,
    color: colors.paper,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    textDecorationLine: 'none',
  },
  secondaryLink: {
    backgroundColor: colors.pale,
    color: colors.forest,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
