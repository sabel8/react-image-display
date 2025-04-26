import type { GalleryImage, RenderedImage } from "./types/types";

export const getImageSize = (
  image: GalleryImage,
  options?: { timeout?: number }
): Promise<RenderedImage> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("WINDOW_IS_NOT_DEFINED");

    if (!image.src) return reject("URL_IS_NOT_DEFINED");

    let timer: number | null = null;

    const img = new Image();

    img.addEventListener("load", () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      resolve({ ...image, width: img.naturalWidth, height: img.naturalHeight });
    });

    img.addEventListener("error", (event) => {
      if (timer) {
        window.clearTimeout(timer);
      }

      reject(`${event.type}: ${event.message}`);
    });

    img.srcset = image.srcset;
    img.sizes = image.sizes;
    img.src = image.src;

    if (options?.timeout) {
      timer = window.setTimeout(() => reject("TIMEOUT"), options.timeout);
    }
  });
};
