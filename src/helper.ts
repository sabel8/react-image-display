export const getImageSize = (
  url: string,
  options?: { timeout?: number }
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("WINDOW_IS_NOT_DEFINED");

    if (!url) return reject("URL_IS_NOT_DEFINED");

    let timer: number | null = null;

    const img = new Image();

    img.addEventListener("load", () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    });

    img.addEventListener("error", (event) => {
      if (timer) {
        window.clearTimeout(timer);
      }

      reject(`${event.type}: ${event.message}`);
    });

    img.src = url;

    if (options?.timeout) {
      timer = window.setTimeout(() => reject("TIMEOUT"), options.timeout);
    }
  });
};

export const expandUrlIfNeeded = (url: string): string => {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    return `${window.origin}/wp-content/uploads/${url}`;

  return url;
};
