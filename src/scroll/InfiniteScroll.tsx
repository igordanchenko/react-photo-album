import type React from "react";
import { cloneElement, useCallback, useRef, useState } from "react";

import useEventCallback from "./useEventCallback";
import { CommonPhotoAlbumProps, Photo } from "../types";

enum Status {
  IDLE,
  LOADING,
  ERROR,
  FINISHED,
}

/** InfiniteScroll component props. */
export type InfiniteScrollProps = {
  /** Photo fetcher. Resolve promise with `null` to indicate end of stream. */
  fetch: (index: number) => Promise<Photo[] | null>;
  /** Initial photos (optional). */
  photos?: Photo[];
  /** Retry attempts. */
  retries?: number;
  /** Use a single photo album component (masonry layout). */
  singleton?: boolean;
  /** IntersectionObserver root margin setting. */
  rootMargin?: string;
  /** Markup to display when an error occurred. */
  error?: React.ReactNode;
  /** Markup to display while fetching additional photos. */
  loading?: React.ReactNode;
  /** Markup to display when no more photos are available. */
  finished?: React.ReactNode;
  /** Photo album component. Must be the only child. */
  children: React.ReactElement<Pick<CommonPhotoAlbumProps, "photos">>;
};

/** InfiniteScroll component. */
export default function InfiniteScroll({
  photos: initialPhotos,
  fetch,
  retries = 0,
  singleton,
  rootMargin = "800px",
  error,
  loading,
  finished,
  children,
}: InfiniteScrollProps) {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [photos, setPhotos] = useState<Photo[][]>(() => (initialPhotos ? [initialPhotos] : []));

  const fetching = useRef(false);
  const observer = useRef<IntersectionObserver>();

  const fetchWithRetry = useEventCallback((index: number) => {
    let attempt = 1;

    const execute = async () => {
      try {
        return await fetch(index);
      } catch (err) {
        if (attempt > retries) {
          throw err;
        }

        await new Promise((resolve) => {
          setTimeout(resolve, 1_000 * 2 ** (attempt - 1));
        });

        attempt += 1;
        return execute();
      }
    };

    return execute();
  });

  const handleFetch = useCallback(async () => {
    if (fetching.current) return;

    const updateStatus = (newStatus: Status) => {
      fetching.current = newStatus === Status.LOADING;
      setStatus(newStatus);
    };

    updateStatus(Status.LOADING);

    try {
      const batch = await fetchWithRetry(photos.length);

      if (batch === null) {
        updateStatus(Status.FINISHED);
        return;
      }

      setPhotos((prev) => [...prev, batch]);
      updateStatus(Status.IDLE);
    } catch (_) {
      updateStatus(Status.ERROR);
    }
  }, [photos.length, fetchWithRetry]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      observer.current?.disconnect();
      observer.current = undefined;

      if (node && typeof IntersectionObserver !== "undefined") {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              handleFetch();
            }
          },
          { rootMargin },
        );
        observer.current.observe(node);
      }
    },
    [rootMargin, handleFetch],
  );

  return (
    <>
      {singleton
        ? cloneElement(children, { photos: photos.flatMap((batch) => batch) })
        : photos.map((batch, index) =>
            cloneElement(children, {
              // eslint-disable-next-line react/no-array-index-key
              key: index,
              photos: batch,
            }),
          )}

      {status === Status.ERROR && error}
      {status === Status.LOADING && loading}
      {status === Status.FINISHED && finished}

      <span ref={sentinelRef} />
    </>
  );
}
