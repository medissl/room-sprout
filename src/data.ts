export const roomImage = require('../assets/room-canvas.jpg');
export const cornerImage = require('../assets/reading-corner.jpg');

export const moods = [
  {
    id: 'earthy',
    name: 'Earthy & easy',
    description: 'Natural textures. A slower pace.',
    image: roomImage,
    palette: ['#76836A', '#D4C5AE', '#8C6E4F'],
    note: 'Layer a warm throw, a little greenery, and soft light around the pieces you already own.',
  },
  {
    id: 'cozy',
    name: 'Cozy corner',
    description: 'Soft light. Stay-a-little-longer energy.',
    image: cornerImage,
    palette: ['#586446', '#E9DDC6', '#977655'],
    note: 'Give one corner a purpose with a warm lamp, tactile cushion, and a place for your favorite book.',
  },
  {
    id: 'natural',
    name: 'Naturally minimal',
    description: 'A little less, a little lighter.',
    image: roomImage,
    palette: ['#C6CAB5', '#F0E9D8', '#A68F72'],
    note: 'Start with a calm neutral base, leave breathing room, and add a single organic accent.',
  },
] as const;
export type MoodId = (typeof moods)[number]['id'];

// Illustration-only catalog. Search destinations are explicit; these are not live listings.
export const products = [
  {
    id: 'lamp',
    name: 'A softer evening',
    type: 'Pleated bedside lamp',
    price: 129000,
    image: require('../assets/lamp.jpg'),
    query: 'lampu meja kap lipat cream',
    why: 'Warm, diffused light makes winding down feel a little easier.',
  },
  {
    id: 'throw',
    name: 'Layers to live in',
    type: 'Sage cotton throw',
    price: 99000,
    image: require('../assets/throw.jpg'),
    query: 'selimut rajut sage green',
    why: 'A muted green layer adds texture without replacing your bedding.',
  },
  {
    id: 'vase',
    name: 'A little organic',
    type: 'Textured ceramic vase',
    price: 59000,
    image: require('../assets/vase.jpg'),
    query: 'vas keramik cream minimalis',
    why: 'An organic shape softens straight furniture lines. Try a branch you already have.',
  },
  {
    id: 'cushion',
    name: 'Your soft spot',
    type: 'Oatmeal cushion cover',
    price: 45000,
    image: require('../assets/cushion.jpg'),
    query: 'sarung bantal sofa linen oatmeal',
    why: 'A washable cover is a small, renter-friendly change with a visible effect.',
  },
] as const;
export type Product = (typeof products)[number];

export function formatPrice(value: number) {
  return `Rp${value.toLocaleString('en-US')}`;
}
export function marketplaceUrl(market: 'shopee' | 'tokopedia', query: string) {
  return market === 'shopee'
    ? `https://shopee.co.id/search?keyword=${encodeURIComponent(query)}`
    : `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(query)}`;
}
export function parseBudget(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const budget = Number(value);
  return Number.isSafeInteger(budget) && budget >= 50000 && budget <= 100000000 ? budget : null;
}
export function picksWithinBudget(budget: number) {
  let total = 0;
  return products.filter((product) => {
    if (total + product.price > budget) return false;
    total += product.price;
    return true;
  });
}
