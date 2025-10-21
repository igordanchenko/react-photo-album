import { useMemo } from "react";

type Callback = (entry: IntersectionObserverEntry) => void;

const observers = new Map<
  string,
  {
    observer: IntersectionObserver;
    listeners: Map<Element, Callback[]>;
  }
>();

function createObserver(root: HTMLElement | null, rootMargin: string) {
  let instance = observers.get(rootMargin);

  if (!instance) {
    const listeners = new Map<Element, Callback[]>();

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

    instance = { observer, listeners };
    observers.set(rootMargin, instance);
  }

  return instance;
}

export default function useIntersectionObserver(rootMargin: string, scrollContainer?: () => HTMLElement | null) {
  const root = scrollContainer?.() ?? null;

  return useMemo(() => {
    const cleanup: (() => void)[] = [];

    const observe = (target: Element, callback: Callback) => {
      const { observer, listeners } = createObserver(root, rootMargin);

      const callbacks = listeners.get(target) || [];
      callbacks.push(callback);
      listeners.set(target, callbacks);

      observer.observe(target);

      cleanup.push(() => {
        callbacks.splice(callbacks.indexOf(callback), 1);

        if (callbacks.length === 0) {
          listeners.delete(target);
          observer.unobserve(target);
        }

        if (listeners.size === 0) {
          observer.disconnect();
          observers.delete(rootMargin);
        }
      });
    };

    const unobserve = () => {
      cleanup.forEach((callback) => callback());
      cleanup.splice(0, cleanup.length);
    };

    return { observe, unobserve };
  }, [root, rootMargin]);
}
