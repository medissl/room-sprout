import { moods, products, parseBudget, picksWithinBudget, type MoodId } from './data';

export type InputMode = 'photos' | 'video' | 'sample';
export type Project = {
  id: string;
  name: string;
  mood: MoodId;
  budget: string;
  items: string[];
  photos: string[];
  mode: InputMode;
  stage: 'room' | 'style' | 'plan';
  prepared: boolean;
  updatedAt: number;
};
export type Snapshot = {
  version: 2;
  projects: Project[];
  favorites: string[];
  inspiration: MoodId;
};
export const emptySnapshot: Snapshot = {
  version: 2,
  projects: [],
  favorites: [],
  inspiration: 'earthy',
};
export const validMood = (value: unknown): value is MoodId => moods.some((m) => m.id === value);
export const validItem = (value: unknown): value is string => products.some((p) => p.id === value);
export function itemTotal(items: string[]) {
  return products.filter((p) => items.includes(p.id)).reduce((sum, p) => sum + p.price, 0);
}
export function planReady(project: Project) {
  const budget = parseBudget(project.budget);
  return !!project.name.trim() && budget !== null && itemTotal(project.items) <= budget;
}
export function newProject(mood: MoodId, number: number, now = Date.now()): Project {
  return {
    id: `room-${now}-${Math.random().toString(36).slice(2, 9)}`,
    name: `My room ${number}`,
    mood,
    budget: '500000',
    items: [],
    photos: [],
    mode: 'photos',
    stage: 'room',
    prepared: false,
    updatedAt: now,
  };
}
export function readSnapshot(raw: string | null): Snapshot {
  if (!raw) return { ...emptySnapshot };
  const data = JSON.parse(raw);
  if (!data || typeof data !== 'object') throw Error('Invalid saved data');
  const favorites = data.favorites;
  if (!Array.isArray(favorites) || !favorites.every(validItem)) throw Error('Invalid favorites');
  if (data.version === undefined && Array.isArray(data.rooms)) {
    const projects = data.rooms.map(
      (room: { id: string; name: string; mood: MoodId; budget: number }, index: number) => {
        if (
          !room ||
          typeof room.id !== 'string' ||
          typeof room.name !== 'string' ||
          !validMood(room.mood) ||
          parseBudget(String(room.budget)) === null
        )
          throw Error('Invalid legacy room');
        return {
          id: `legacy-${room.id}`,
          name: room.name.slice(0, 40),
          mood: room.mood,
          budget: String(room.budget),
          items: picksWithinBudget(room.budget).map((p) => p.id),
          photos: [],
          mode: 'sample',
          stage: 'plan',
          prepared: true,
          updatedAt: index,
        } satisfies Project;
      },
    );
    return {
      version: 2,
      projects,
      favorites: [...new Set(favorites)] as string[],
      inspiration: 'earthy',
    };
  }
  if (
    data.version !== 2 ||
    !validMood(data.inspiration) ||
    !Array.isArray(data.projects) ||
    data.projects.length > 100
  )
    throw Error('Unknown collection');
  const ids = new Set();
  for (const p of data.projects) {
    if (
      !p ||
      typeof p.id !== 'string' ||
      !p.id ||
      ids.has(p.id) ||
      typeof p.name !== 'string' ||
      p.name.length > 40 ||
      !validMood(p.mood) ||
      typeof p.budget !== 'string' ||
      p.budget.length > 12 ||
      !['photos', 'video', 'sample'].includes(p.mode) ||
      !['room', 'style', 'plan'].includes(p.stage) ||
      !Array.isArray(p.items) ||
      !p.items.every(validItem) ||
      new Set(p.items).size !== p.items.length ||
      !Array.isArray(p.photos) ||
      p.photos.length > 3 ||
      !p.photos.every(
        (photo: unknown) =>
          typeof photo === 'string' &&
          photo.startsWith('data:image/jpeg;base64,') &&
          photo.length <= 600000,
      ) ||
      typeof p.prepared !== 'boolean' ||
      !Number.isFinite(p.updatedAt)
    )
      throw Error('Invalid room');
    ids.add(p.id);
  }
  return {
    version: 2,
    projects: data.projects,
    favorites: [...new Set(favorites)] as string[],
    inspiration: data.inspiration,
  };
}
