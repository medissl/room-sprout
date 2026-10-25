import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { moods, products, type MoodId } from './data';

type SavedRoom = { id: string; mood: MoodId; budget: number; name: string };
type Store = {
  mood: MoodId;
  setMood: (mood: MoodId) => void;
  budget: number;
  setBudget: (budget: number) => void;
  photos: string[];
  setPhotos: (photos: string[]) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  rooms: SavedRoom[];
  saveRoom: () => void;
  removeRoom: (id: string) => void;
  storageError: string;
  ready: boolean;
};
const Context = createContext<Store | null>(null);
const storageKey = 'roomsprout.prototype.v1';

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState<MoodId>('earthy');
  const [budget, setBudget] = useState(500000);
  const [photos, setPhotos] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [rooms, setRooms] = useState<SavedRoom[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const writes = useRef(Promise.resolve());
  const canPersist = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (!active) return;
        if (!raw) {
          canPersist.current = true;
          return;
        }
        const data: unknown = JSON.parse(raw);
        if (!data || typeof data !== 'object') throw new Error('Invalid saved collection');
        const stored = data as { favorites?: unknown; rooms?: unknown };
        if (Array.isArray(stored.favorites))
          setFavorites(
            stored.favorites.filter(
              (id): id is string => typeof id === 'string' && products.some((p) => p.id === id),
            ),
          );
        if (Array.isArray(stored.rooms))
          setRooms(
            stored.rooms.filter(
              (room): room is SavedRoom =>
                !!room &&
                typeof room === 'object' &&
                typeof room.id === 'string' &&
                typeof room.name === 'string' &&
                moods.some((m) => m.id === room.mood) &&
                Number.isSafeInteger(room.budget) &&
                room.budget >= 50000 &&
                room.budget <= 100000000,
            ),
          );
        canPersist.current = true;
      })
      .catch(() => {
        if (active) setStorageError('Saved items could not be loaded on this device.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !canPersist.current) return;
    // Serialize writes so a rapid save/unsave cannot restore stale state.
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(storageKey, JSON.stringify({ favorites, rooms })))
      .catch(() =>
        setStorageError(
          'Changes are available this session, but could not be saved to this device.',
        ),
      );
  }, [favorites, rooms, ready]);
  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }
  function saveRoom() {
    const id = `${mood}-${budget}`;
    setRooms((current) =>
      current.some((room) => room.id === id)
        ? current
        : [{ id, mood, budget, name: moods.find((item) => item.id === mood)!.name }, ...current],
    );
  }
  return (
    <Context.Provider
      value={{
        mood,
        setMood,
        budget,
        setBudget,
        photos,
        setPhotos,
        favorites,
        toggleFavorite,
        rooms,
        saveRoom,
        removeRoom: (id) => setRooms((current) => current.filter((room) => room.id !== id)),
        storageError,
        ready,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useRoom() {
  const store = useContext(Context);
  if (!store) throw new Error('RoomProvider is required');
  return store;
}
