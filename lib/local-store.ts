// A value kept in the visitor's browser and shared by every component that
// reads it: save a course on the home page and the header's count and the
// catalogue's heart agree, in this tab and in any other one open on the site.
//
// Read it with React's `useSyncExternalStore(store.subscribe, store.read,
// store.server)`. The server has no storage to read, so it renders the
// fallback, and so does the browser's first render: that is what keeps
// hydration quiet. The stored value arrives on the render after, which is the
// same moment a real product's signed-in state would.
export function localStore<T>(
  key: string,
  fallback: T,
  valid: (v: unknown) => v is T,
) {
  // One parsed value per change rather than per read: a snapshot has to be
  // the same object until something writes, or React re-renders forever.
  let cached: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (cached !== undefined) return cached;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed: unknown = raw === null ? fallback : JSON.parse(raw);
      cached = valid(parsed) ? parsed : fallback;
    } catch {
      // Private windows and blocked storage throw; the demo keeps working on
      // the fallback rather than on an error.
      cached = fallback;
    }
    return cached;
  };

  const write = (next: T) => {
    cached = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage full or blocked: the value still lives for this page view.
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    // Another tab wrote: drop the cached copy so the next read is fresh.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cached = undefined;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { read, write, subscribe, server: () => fallback };
}
