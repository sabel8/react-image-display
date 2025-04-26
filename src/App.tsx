import { useEffect, useState } from "react";
import { expandUrlIfNeeded, getImageSize } from "./helper";
import { useQuery } from "@tanstack/react-query";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoAlbum from "react-photo-album";
import "photoswipe/style.css";
import { Spinner } from "./Spinner/Spinner";
import PhotoSwipe from "photoswipe";

type Image = {
  src: string;
  width: number;
  height: number;
};

async function fetchImageDimensions(urls: string[]): Promise<Image[]> {
  const result = await Promise.all(
    urls.map(async (url) => {
      const { width, height } = await getImageSize(url);
      return { src: url, width, height };
    })
  );
  return result;
}

function App(props: { elementId?: string, images: string[], rowheight?: number }) {
  const images: string[] = props.images;
  const galleryID = "gallery-" +( props.elementId ??"react-image-display");
  const height = props.rowheight ?? 400;

  const processedImages = images.map(expandUrlIfNeeded);

  const query = useQuery({
    queryKey: ["image-dimensions", processedImages.join(",")],
    queryFn: () => fetchImageDimensions(processedImages),
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
          <img src={imageProps.src} width="100%" height="100%" />
        </a>
      )}
    />
  );
}

export default App;
