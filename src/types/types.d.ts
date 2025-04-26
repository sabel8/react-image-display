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
  width: number;
  height: number;
  blurhash?: string;
};

export type Gallery = {
  elementid: string;
  images: GalleryImage[];
  rowheight: number;
};
