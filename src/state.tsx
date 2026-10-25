import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { type MoodId } from './data';
import {
  emptySnapshot,
  newProject,
  readSnapshot,
  validItem,
  type Project,
  type Snapshot,
} from './model';
import { createSaveQueue } from './persistence';

type Notice = { text: string; undo?: () => void };
type Clip = { uri: string; duration: number };
type Store = Snapshot & {
  ready: boolean;
  status: 'saved' | 'saving' | 'error';
  storageError: string;
  notice: Notice | null;
  notify: (text: string, undo?: () => void) => void;
  dismissNotice: () => void;
  createRoom: (mood?: MoodId) => Project | undefined;
  updateRoom: (
    id: string,
    patch: Partial<Omit<Project, 'id'>> | ((room: Project) => Partial<Omit<Project, 'id'>>),
  ) => void;
  removeRoom: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setInspiration: (mood: MoodId) => void;
  flush: () => Promise<boolean>;
  retry: () => void;
  clips: Record<string, Clip>;
  setClip: (id: string, clip: Clip | undefined) => void;
};
const Context = createContext<Store | null>(null);
const storageKey = 'roomsprout.prototype.v1';

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const current = useRef(snapshot);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Store['status']>('saved');
  const [storageError, setStorageError] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [clips, setClips] = useState<Record<string, Clip>>({});
  const writable = useRef(false);
  const revision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reads = useRef(0);
  const active = useRef(true);
  const queue = useRef(createSaveQueue((payload) => AsyncStorage.setItem(storageKey, payload)));
  const load = useCallback(() => {
    const ticket = ++reads.current;
    return AsyncStorage.getItem(storageKey)
      .then((raw) => {
        const saved = readSnapshot(raw);
        if (!active.current || ticket !== reads.current) return;
        current.current = saved;
        setSnapshot(saved);
        writable.current = true;
        setReady(true);
        setStorageError('');
        setStatus('saved');
      })
      .catch(() => {
        if (!active.current || ticket !== reads.current) return;
        writable.current = false;
        setReady(false);
        setStatus('error');
        setStorageError('Saved rooms could not be loaded. Retry to keep your existing data safe.');
      });
  }, []);
  useEffect(() => {
    active.current = true;
    void load();
    return () => {
      active.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load]);
  useEffect(() => {
    if (!notice || notice.undo) return;
    const timeout = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);
  function notify(text: string, undo?: () => void) {
    setNotice({ text, undo });
  }
  async function flush() {
    if (timer.current) clearTimeout(timer.current);
    if (!writable.current) return false;
    const ticket = revision.current;
    setStatus('saving');
    const saved = await queue.current.enqueue(JSON.stringify(current.current));
    if (ticket === revision.current) {
      setStatus(saved ? 'saved' : 'error');
      setStorageError(
        saved
          ? ''
          : 'Changes are kept this session. Free device storage or remove a reference photo, then retry.',
      );
    }
    return saved;
  }
  function change(update: (value: Snapshot) => Snapshot) {
    if (!writable.current) return;
    current.current = update(current.current);
    revision.current++;
    setSnapshot(current.current);
    setStatus('saving');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush();
    }, 300);
  }
  function createRoom(mood = current.current.inspiration) {
    if (!writable.current) return;
    if (current.current.projects.length >= 100) {
      notify('Keep up to 100 rooms on this device.');
      return;
    }
    const project = newProject(mood, current.current.projects.length + 1);
    setNotice(null);
    change((s) => ({ ...s, projects: [project, ...s.projects] }));
    return project;
  }
  function updateRoom(
    id: string,
    patch: Partial<Omit<Project, 'id'>> | ((room: Project) => Partial<Omit<Project, 'id'>>),
  ) {
    change((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === id
          ? { ...p, ...(typeof patch === 'function' ? patch(p) : patch), updatedAt: Date.now() }
          : p,
      ),
    }));
  }
  function removeRoom(id: string) {
    const project = current.current.projects.find((p) => p.id === id);
    if (!project) return;
    change((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
    notify(`${project.name || 'Room'} removed`, () => {
      change((s) =>
        s.projects.some((p) => p.id === id) ? s : { ...s, projects: [project, ...s.projects] },
      );
      setNotice(null);
    });
  }
  function toggleFavorite(id: string) {
    if (!validItem(id)) return;
    const saved = current.current.favorites.includes(id);
    change((s) => ({
      ...s,
      favorites: saved ? s.favorites.filter((item) => item !== id) : [...s.favorites, id],
    }));
    notify(
      saved ? 'Find removed' : 'Find saved',
      saved
        ? () => {
            change((s) => ({ ...s, favorites: [...new Set([...s.favorites, id])] }));
            setNotice(null);
          }
        : undefined,
    );
  }
  return (
    <Context.Provider
      value={{
        ...snapshot,
        ready,
        status,
        storageError,
        notice,
        notify,
        dismissNotice: () => setNotice(null),
        createRoom,
        updateRoom,
        removeRoom,
        toggleFavorite,
        flush,
        setInspiration: (inspiration) => change((s) => ({ ...s, inspiration })),
        retry: () => {
          if (writable.current) void flush();
          else void load();
        },
        clips,
        setClip: (id, clip) =>
          setClips((s) => {
            const next = { ...s };
            if (clip) next[id] = clip;
            else delete next[id];
            return next;
          }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useRoom() {
  const store = useContext(Context);
  if (!store) throw Error('RoomProvider is required');
  return store;
}
