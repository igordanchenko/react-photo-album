import type React from "react";
import { Children, cloneElement, isValidElement, useCallback, useRef, useState } from "react";

import Offscreen from "./Offscreen";
import useEventCallback from "./useEventCallback";
import useIntersectionObserver from "./useIntersectionObserver";
import { ClickHandlerProps, CommonPhotoAlbumProps, Photo, RenderTrackProps } from "../types";

enum Status {
  IDLE,
  LOADING,
  ERROR,
  FINISHED,
}

/** InfiniteScroll component props. */
export type InfiniteScrollProps<TPhoto extends Photo = Photo> = {
  /** Photo fetcher. Resolve promise with `null` to indicate end of stream. */
  fetch: (index: number) => Promise<TPhoto[] | null>;
  /** Initial photos (optional). */
  photos?: TPhoto[];
  /** Click handler */
  onClick?: ({ photos, photo, index, event }: ClickHandlerProps<TPhoto> & { photos: TPhoto[] }) => void;
  /** Retry attempts. */
  retries?: number;
  /** Use a single photo album component (masonry layout). */
  singleton?: boolean;
  /** Markup to display when an error occurred. */
  error?: React.ReactNode;
  /** Markup to display while fetching additional photos. */
  loading?: React.ReactNode;
  /** Markup to display when no more photos are available. */
  finished?: React.ReactNode;
  /** The nearest scrollable ancestor other than the viewport.  */
  scrollContainer?: () => HTMLElement | null;
  /** Fetcher `IntersectionObserver` root margin setting. Default: `800px` */
  fetchRootMargin?: string;
  /** Offscreen `IntersectionObserver` root margin setting. Default: `2000px` */
  offscreenRootMargin?: string;
  /** Photo album component. Must be the only child. */
  children: React.ReactElement<Pick<CommonPhotoAlbumProps<TPhoto>, "photos" | "render" | "onClick">>;
};

/** InfiniteScroll component. */
export default function InfiniteScroll<TPhoto extends Photo>({
  photos: initialPhotos,
  onClick,
  fetch,
  retries = 0,
  singleton,
  error,
  loading,
  finished,
  children,
  scrollContainer,
  fetchRootMargin = "800px",
  offscreenRootMargin = "2000px",
}: InfiniteScrollProps<TPhoto>) {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [photos, setPhotos] = useState<TPhoto[][]>(() => (initialPhotos ? [initialPhotos] : []));

  const { observe, unobserve } = useIntersectionObserver(fetchRootMargin, scrollContainer);

  const fetching = useRef(false);

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
      unobserve();

      if (node) {
        observe(node, ({ isIntersecting }) => {
          if (isIntersecting) {
            handleFetch();
          }
        });
      }
    },
    [observe, unobserve, handleFetch],
  );

  const photosArray = photos.flatMap((batch) => batch);

  const handleClick = onClick
    ? ({ photo, event }: ClickHandlerProps<TPhoto>) => {
        onClick({ photos: photosArray, index: photosArray.findIndex((item) => item === photo), photo, event });
      }
    : undefined;

  return (
    <>
      {singleton
        ? cloneElement(children, {
            photos: photosArray,
            onClick: handleClick,
            render: {
              ...children.props.render,
              track: ({ children: trackChildren, ...rest }: RenderTrackProps) => (
                <div {...rest}>
                  {Children.map(
                    trackChildren,
                    (child, index) =>
                      isValidElement(child) && (
                        <Offscreen key={index} rootMargin={offscreenRootMargin} scrollContainer={scrollContainer}>
                          {child}
                        </Offscreen>
                      ),
                  )}
                </div>
              ),
            },
          })
        : photos.map((batch, index) => (
            <Offscreen key={index} rootMargin={offscreenRootMargin} scrollContainer={scrollContainer}>
              {cloneElement(children, {
                photos: batch,
                onClick: handleClick,
              })}
            </Offscreen>
          ))}

      {status === Status.ERROR && error}
      {status === Status.LOADING && loading}
      {status === Status.FINISHED && finished}

      <span ref={sentinelRef} />
    </>
  );
}
