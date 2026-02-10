import { useMemo } from "react";

type Callback = (entry: IntersectionObserverEntry) => void;

type ObserverInstance = {
  id: string;
  observer: IntersectionObserver;
  listeners: Map<Element, Set<Callback>>;
};

// shared pool of `IntersectionObserver` instances keyed by `root` + `rootMargin`
const observers = new Map<string, ObserverInstance>();

// `WeakMap` allows garbage collection of detached scroll container elements
let rootId = 0;
const rootIds = new WeakMap<Element, number>();

// generate stable numeric ID for a `root` element (0 for document viewport)
function getRootId(root: Element | null) {
  if (!root) return 0;
  if (rootIds.has(root)) return rootIds.get(root)!;
  rootIds.set(root, ++rootId);
  return rootId;
}

// composite key for observer pooling: `"{rootId}_{rootMargin}"`
function getObserverId(root: Element | null, rootMargin: string) {
  return `${getRootId(root)}_${rootMargin}`;
}

// get or create a shared `IntersectionObserver` for the given `root` + `rootMargin`
function createObserver(root: Element | null, rootMargin: string) {
  const id = getObserverId(root, rootMargin);
  let instance = observers.get(id);

  if (!instance) {
    const listeners = new Map<Element, Set<Callback>>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          listeners.get(entry.target)?.forEach((callback) => {
            callback(entry);
          });
        });
      },
      { root, rootMargin },
    );

    instance = { id, observer, listeners };
    observers.set(id, instance);
  }

  return instance;
}

/**
 * Hook for observing element intersections with a shared `IntersectionObserver` pool.
 * Multiple components using the same `root` + `rootMargin` share one observer instance.
 */
export default function useIntersectionObserver(rootMargin: string, scrollContainer?: () => HTMLElement | null) {
  const root = scrollContainer?.() ?? null;

  return useMemo(() => {
    const cleanup: (() => void)[] = [];

    const observe = (target: Element, callback: Callback) => {
      const { id, observer, listeners } = createObserver(root, rootMargin);

      // register the target with the shared observer if not already observed
      let callbacks = listeners.get(target);
      if (!callbacks) {
        callbacks = new Set();
        listeners.set(target, callbacks);
        observer.observe(target);
      }

      // skip duplicate callback to avoid registering multiple cleanup functions
      if (callbacks.has(callback)) {
        return;
      }

      callbacks.add(callback);

      // register cleanup to run when unobserve is called
      cleanup.push(() => {
        callbacks.delete(callback);

        // unobserve the target when no callbacks remain
        if (callbacks.size === 0) {
          listeners.delete(target);
          observer.unobserve(target);
        }

        // disconnect and remove observer when no targets remain
        if (listeners.size === 0) {
          observer.disconnect();
          observers.delete(id);
        }
      });
    };

    // run all cleanup functions and reset
    const unobserve = () => {
      cleanup.forEach((callback) => callback());
      cleanup.splice(0, cleanup.length);
    };

    return { observe, unobserve };
  }, [root, rootMargin]);
}
