import { Photo } from "react-photo-album";

import photos from "./photos.ts";

export default function photoFetcher({ batchSize = 10, maxBatches = 100, fetchDelay = 300 } = {}) {
  return (index: number) =>
    new Promise<Photo[] | null>((resolve, reject) => {
      if (!navigator.onLine) {
        reject(new Error("Failed to load photos"));
        return;
      }

      const batch = [
        ...photos.map((photo) => ({
          ...photo,
          // generate unique keys since we are reusing the same photos
          key: `${index}-${photo.src}`,
        })),
      ];

      // shuffle
      for (let i = batch.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [batch[i], batch[j]] = [batch[j], batch[i]];
      }

      const result = maxBatches <= 0 || index < maxBatches ? batch.slice(0, Math.min(batchSize, photos.length)) : null;
      setTimeout(() => resolve(result), (Math.random() + 0.2) * fetchDelay);
    });
}
