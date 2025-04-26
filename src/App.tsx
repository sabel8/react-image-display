import { useEffect, useState } from "react";
import { getImageSize } from "./helper";
import { useQuery } from "@tanstack/react-query";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoAlbum from "react-photo-album";
import "photoswipe/style.css";
import { Spinner } from "./Spinner/Spinner";
import PhotoSwipe from "photoswipe";
import type { Gallery } from "./types/types";

function App({ elementid, images, rowheight }: Gallery) {
  const galleryID = "gallery-" + (elementid ?? "react-image-display");
  const height = rowheight ?? 400;

  const query = useQuery({
    queryKey: [galleryID, "image-dimensions", images.join(",")],
    queryFn: () =>
      Promise.all(images.map(async (image) => await getImageSize(image))),
  });

  const [lightbox, setLightbox] = useState<PhotoSwipeLightbox | null>(null);
  useEffect(() => {
    if (!query.data) return;
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
  }, [galleryID, lightbox, query.data]);

  if (query.isPending)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 50,
          width: "100%",
        }}
      >
        <Spinner />
        <span style={{ fontSize: 16 }}>Loading...</span>
      </div>
    );

  if (query.isError) return <div>Error: {query.error.message}</div>;

  return (
    <PhotoAlbum
      layout="rows"
      photos={query.data}
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
          <img
            src={imageProps.src}
            srcSet={photo.srcset}
            sizes={photo.sizes}
            width="100%"
            height="100%"
          />
        </a>
      )}
    />
  );
}

export default App;
