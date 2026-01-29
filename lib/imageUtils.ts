// src/lib/imageUtils.ts

export const TOTAL_FRAMES = 150;

/**
 * Generate microscope image paths (0001 to 0150)
 */
export const generateImagePaths = () => {
  const images: string[] = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const paddedNumber = i.toString().padStart(4, "0");
    images.push(`/images2/${paddedNumber}_converted.avif`);
  }
  return images;
};

export const MICROSCOPE_IMAGES = generateImagePaths();

/**
 * Preload microscope images with progress callback
 */
export const loadMicroscopeImages = (
  onProgress?: (progress: number) => void
): Promise<HTMLImageElement[]> => {
  return new Promise((resolve) => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((imageResolve) => {
        const img = new window.Image();
        img.src = MICROSCOPE_IMAGES[index];
        img.onload = async () => {
          // Decode image immediately to avoid decode jank during scroll
          try {
            await img.decode();
          } catch (e) {
            // Decode failed, but continue
            console.warn(`Failed to decode image ${index}`);
          }
          images[index] = img;
          loaded++;
          if (onProgress) {
            onProgress(loaded / TOTAL_FRAMES);
          }
          imageResolve();
        };
        img.onerror = () => {
          loaded++;
          if (onProgress) {
            onProgress(loaded / TOTAL_FRAMES);
          }
          imageResolve();
        };
      });
    };

    const loadAllImages = async () => {
      // Load first 20 images first for faster initial display
      for (let i = 0; i < 20; i++) {
        await loadImage(i);
      }

      // Then load rest in parallel batches
      const batchSize = 15;
      for (let i = 20; i < TOTAL_FRAMES; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }

      resolve(images);
    };

    loadAllImages();
  });
};

/**
 * Render a specific frame to canvas
 */
export const renderFrameToCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx || !image) return;

  if (
    image.naturalWidth &&
    (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight)
  ) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }

  // No need to clear if we're drawing a full-frame image
  ctx.drawImage(image, 0, 0);
};
