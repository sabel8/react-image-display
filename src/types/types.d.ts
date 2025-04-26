declare global {
  interface Window {
    rid_params?: {
      galleries?: Gallery[];
    };
  }
}

export type GalleryImage = {
  src: string;
  srcset: string;
  sizes: string;
};

export type Gallery = {
  elementid: string;
  images: GalleryImage[];
  rowheight: number;
};

export type RenderedImage = GalleryImage & {
  width: number;
  height: number;
};
