import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Logo, TextAction, Button } from '../../components/ui';
import { formatPrice, products, type Product } from '../../data';
import { useRoom } from '../../state';
import { colors, fonts, ui } from '../../theme';
const categories = ['All', 'Lighting', 'Textiles', 'Objects'] as const;
export default function Finds() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const { favorites } = useRoom();
  const visible = products.filter(
    (p) =>
      (!savedOnly || favorites.includes(p.id)) &&
      (category === 'All' ||
        (category === 'Lighting' && p.id === 'lamp') ||
        (category === 'Textiles' && ['throw', 'cushion'].includes(p.id)) ||
        (category === 'Objects' && p.id === 'vase')) &&
      (p.type + ' ' + p.name).toLowerCase().includes(query.trim().toLowerCase()),
  );
  function reset() {
    setQuery('');
    setCategory('All');
    setSavedOnly(false);
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
      <View style={s.header}>
        <Logo small />
        <TextAction
          label={`Saved (${favorites.length})`}
          selected={savedOnly}
          onPress={() => setSavedOnly(!savedOnly)}
        >
          Saved
        </TextAction>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.content}
      >
        <Text accessibilityRole="header" style={s.title}>
          Little finds.{'\n'}Good energy.
        </Text>
        <Text style={s.disclosure}>Concept pieces. Estimated prices.</Text>
        <View style={s.search}>
          <TextInput
            accessibilityLabel="Search decor finds"
            placeholder="Find a finishing touch"
            value={query}
            onChangeText={setQuery}
            style={s.input}
            placeholderTextColor={colors.muted}
          />
          {!!query && (
            <TextAction label="Clear search" onPress={() => setQuery('')}>
              Clear
            </TextAction>
          )}
        </View>
        <View
          style={s.categories}
          accessibilityRole="radiogroup"
          accessibilityLabel="Find categories"
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityLabel={item === 'All' ? 'All finds' : item}
              aria-checked={category === item}
              onPress={() => setCategory(item)}
              style={[s.category, category === item && s.activeCategory]}
            >
              <Text style={[s.categoryText, category === item && { fontFamily: fonts.bold }]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {visible.length ? (
          <View style={s.grid}>
            {[0, 1].map((column) => (
              <View key={column} style={[s.column, column === 1 && { paddingTop: 44 }]}>
                {visible
                  .filter((_, index) => index % 2 === column)
                  .map((product) => (
                    <FindTile key={product.id} product={product} />
                  ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ gap: 14, paddingVertical: 30 }}>
            <Text accessibilityRole="header" style={ui.heading}>
              {savedOnly && !favorites.length
                ? 'Your collection starts here.'
                : 'No matching finds.'}
            </Text>
            <Text style={ui.body}>
              {savedOnly && !favorites.length
                ? 'Save pieces you want to come back to.'
                : 'Try another search or clear your filters.'}
            </Text>
            <Button secondary onPress={reset}>
              {savedOnly && !favorites.length ? 'Explore all finds' : 'Reset search and filters'}
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
function FindTile({ product }: { product: Product }) {
  const { favorites, toggleFavorite, ready } = useRoom();
  const saved = favorites.includes(product.id);
  const cutout = product.id === 'lamp' || product.id === 'vase';
  const image =
    product.id === 'lamp'
      ? require('../../../assets/lamp-cutout.png')
      : product.id === 'vase'
        ? require('../../../assets/vase-cutout.png')
        : product.image;
  const shortName = {
    lamp: 'Pleated lamp',
    throw: 'Sage throw',
    vase: 'Olive stem vase',
    cushion: 'Linen cushion',
  }[product.id];
  return (
    <View style={s.tile}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.type}`}
        onPress={() => router.push({ pathname: '/product', params: { id: product.id } })}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <View
          style={[
            s.object,
            product.id === 'lamp' && s.lampSurface,
            product.id === 'vase' && s.vaseSurface,
            product.id === 'throw' && s.throwSurface,
            product.id === 'cushion' && s.cushionSurface,
          ]}
        >
          <Image
            source={image}
            accessibilityLabel={`${product.type} concept image`}
            resizeMode={cutout ? 'contain' : 'cover'}
            style={[s.image, cutout && s.cutout]}
          />
        </View>
        <Text style={s.productName}>{shortName}</Text>
      </Pressable>
      <View style={s.meta}>
        <Text style={s.price}>{formatPrice(product.price)}</Text>
        <TextAction
          label={saved ? `Unsave ${product.type}` : `Save ${product.type}`}
          selected={saved}
          disabled={!ready}
          onPress={() => {
            if (ready) toggleFavorite(product.id);
          }}
        >
          {saved ? 'Saved' : 'Save'}
        </TextAction>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  intro: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 35,
    lineHeight: 35,
    letterSpacing: -1.7,
    color: colors.forest,
  },
  disclosure: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 12,
    marginBottom: 5,
  },
  search: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  input: {
    flex: 1,
    minHeight: 48,
    minWidth: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 23,
    marginTop: 4,
  },
  category: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCategory: { borderBottomColor: colors.forest },
  categoryText: { fontFamily: fonts.regular, color: colors.forest, fontSize: 12 },
  grid: { flexDirection: 'row', gap: 19 },
  column: { flex: 1, minWidth: 0, gap: 24 },
  tile: { gap: 0 },
  object: { width: '100%', height: 186, overflow: 'hidden' },
  lampSurface: {
    height: 204,
    backgroundColor: colors.sage,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  vaseSurface: { height: 224 },
  throwSurface: {
    height: 158,
    borderTopRightRadius: 52,
    borderBottomLeftRadius: 52,
    backgroundColor: colors.sand,
  },
  cushionSurface: { height: 155, borderRadius: 7, backgroundColor: colors.sand },
  image: { width: '100%', height: '100%' },
  cutout: { width: '86%', height: '92%', alignSelf: 'center', marginTop: 8 },
  productName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.forest,
    marginTop: 11,
    letterSpacing: -0.3,
  },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2 },
  price: { fontFamily: fonts.regular, fontSize: 12, color: colors.brown },
});
