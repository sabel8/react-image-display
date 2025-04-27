import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoAlbum from "react-photo-album";
import "photoswipe/style.css";
import PhotoSwipe from "photoswipe";
import type { Gallery } from "./types/types";
import ImageComponent from "./ImageComponent";

function App({ elementid, images, rowheight }: Gallery) {
  const galleryID = "gallery-" + (elementid ?? "react-image-display");
  const height = rowheight ?? 400;

  const [lightbox, setLightbox] = useState<PhotoSwipeLightbox | null>(null);
  useEffect(() => {
    if (!lightbox)
      setLightbox(
        new PhotoSwipeLightbox({
          gallery: "#" + galleryID,
          children: "a",
          pswpModule: PhotoSwipe,
        })
      );
    lightbox?.init();

    return () => {
      lightbox?.destroy();
    };
  }, [galleryID, lightbox]);

  return (
    <PhotoAlbum
      layout="rows"
      photos={images}
      rowConstraints={{ singleRowMaxHeight: height }}
      targetRowHeight={height}
      // spacing={5}
      renderContainer={(albumProps) => (
        <div
          {...albumProps.containerProps}
          ref={albumProps.containerRef}
          className={albumProps.containerProps.className + " pswp-gallery"}
          id={galleryID}
        >
          {albumProps.children}
        </div>
      )}
      renderPhoto={({ imageProps, photo, wrapperStyle }) => (
        <a
          href={imageProps.src}
          data-pswp-width={photo.width}
          data-pswp-height={photo.height}
          data-pswp-srcset={photo.srcset}
          style={{
            // height: imageProps.height,
            width: imageProps.width,
            display: "block",
            ...wrapperStyle,
          }}
          key={galleryID + "-" + imageProps.src}
          target="_blank"
          rel="noreferrer"
        >
          <ImageComponent image={photo} />
        </a>
      )}
    />
  );
}

export default App;
