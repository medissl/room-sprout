import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Logo, TextAction } from '../../components/ui';
import { Materials } from '../../components/Materials';
import { ProductRow } from '../../components/ProductRow';
import { formatPrice, products, roomImage, cornerImage, type Product } from '../../data';
import { useRoom } from '../../state';
import { colors, fonts, ui } from '../../theme';

const categories = ['All', 'Lighting', 'Textiles', 'Objects'] as const;
export default function Finds() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const { favorites } = useRoom();
  const visible = products.filter(
    (product) =>
      (!savedOnly || favorites.includes(product.id)) &&
      (category === 'All' ||
        (category === 'Lighting' && product.id === 'lamp') ||
        (category === 'Textiles' && ['throw', 'cushion'].includes(product.id)) ||
        (category === 'Objects' && product.id === 'vase')) &&
      `${product.name} ${product.type}`.toLowerCase().includes(query.toLowerCase().trim()),
  );
  const board = !searching && !savedOnly && category === 'All';
  function open(product: Product) {
    router.push({ pathname: '/product', params: { id: product.id } });
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
      <View style={s.header}>
        <Logo />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.heading}>
          <Text accessibilityRole="header" style={ui.title}>
            Good finds
          </Text>
          <View style={[ui.row, { gap: 18 }]}>
            <TextAction
              onPress={() => {
                if (searching) setQuery('');
                setSearching(!searching);
              }}
            >
              Search
            </TextAction>
            <TextAction
              label={`Saved (${favorites.length})`}
              selected={savedOnly}
              onPress={() => {
                setCategory('All');
                setSavedOnly(!savedOnly);
              }}
            >
              Saved
            </TextAction>
          </View>
        </View>
        {searching && (
          <View style={s.search}>
            <TextInput
              autoFocus
              accessibilityLabel="Search decor finds"
              placeholder="Find something for your room"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              style={s.input}
            />
            {query ? (
              <TextAction label="Clear search" onPress={() => setQuery('')}>
                Clear
              </TextAction>
            ) : null}
          </View>
        )}
        <View style={s.categories}>
          {categories.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityLabel={item === 'All' ? 'All finds' : item}
              accessibilityState={{ selected: category === item && !savedOnly }}
              onPress={() => {
                setCategory(item);
                setSavedOnly(false);
              }}
              style={[
                s.category,
                category === item && !savedOnly && { borderBottomColor: colors.forest },
              ]}
            >
              <Text
                style={[
                  ui.label,
                  {
                    color: category === item && !savedOnly ? colors.forest : colors.muted,
                    fontSize: 13,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {board ? (
          <>
            <View style={s.board}>
              <Image
                source={require('../../../assets/finds-board.jpg')}
                style={s.boardPhoto}
                accessibilityLabel="Lamp, sage throw, and ceramic vase in a cream material still life"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Pleated bedside lamp"
                onPress={() => open(products[0])}
                style={s.lampLabel}
              >
                <Text style={s.productTitle}>Pleated lamp</Text>
                <Text style={s.price}>{formatPrice(products[0].price)}</Text>
                <Text style={s.view}>View</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Sage cotton throw"
                onPress={() => open(products[1])}
                style={s.throwLabel}
              >
                <Text style={s.smallTitle}>Sage throw</Text>
                <Text style={s.price}>{formatPrice(products[1].price)}</Text>
                <Text style={s.view}>View</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Textured ceramic vase"
                onPress={() => open(products[2])}
                style={s.vaseLabel}
              >
                <Text style={s.smallTitle}>Ceramic vase</Text>
                <Text style={s.price}>{formatPrice(products[2].price)}</Text>
                <Text style={s.view}>View</Text>
              </Pressable>
            </View>
            <View style={s.samples}>
              <Materials size={53} />
            </View>
            <View style={s.collection}>
              <Text accessibilityRole="header" style={ui.heading}>
                For your soft reset
              </Text>
              <View style={s.collectionPhotos}>
                {[roomImage, cornerImage, products[3].image].map((image, index) => (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    accessibilityLabel={
                      index === 2 ? 'View Oatmeal cushion cover' : 'Explore room collection'
                    }
                    onPress={() => (index === 2 ? open(products[3]) : router.push('/result'))}
                    style={{ flex: 1 }}
                  >
                    <Image source={image} style={s.collectionImage} />
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={s.results}>
            {visible.length ? (
              visible.map((product) => <ProductRow key={product.id} product={product} />)
            ) : (
              <Text style={[ui.heading, { paddingVertical: 35 }]}>Nothing here just yet.</Text>
            )}
          </View>
        )}
        <Text style={s.disclosure}>Concept collection. Prices estimated.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  header: { height: 56, alignItems: 'center', justifyContent: 'center' },
  heading: {
    paddingHorizontal: 24,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  category: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  search: {
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 48,
    minWidth: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
  },
  board: { width: '100%', aspectRatio: 0.8 },
  boardPhoto: { position: 'absolute', width: '100%', height: '100%' },
  lampLabel: { position: 'absolute', left: '6%', bottom: '7%', minWidth: 120, minHeight: 65 },
  throwLabel: { position: 'absolute', right: '5%', top: '3%', minHeight: 64 },
  vaseLabel: { position: 'absolute', right: '5%', bottom: '7%', minHeight: 64 },
  productTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  smallTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  price: { fontFamily: fonts.regular, fontSize: 11, color: colors.brown, marginTop: 2 },
  view: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.forest,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  samples: { alignItems: 'center', marginTop: -18, height: 60 },
  collection: { gap: 14, paddingTop: 10 },
  collectionPhotos: { flexDirection: 'row', gap: 3 },
  collectionImage: { width: '100%', height: 130 },
  results: { paddingHorizontal: 24 },
  disclosure: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
});
