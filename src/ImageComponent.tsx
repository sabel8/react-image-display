import { GalleryImage } from "./types/types";
import { useMemo, useState } from "react";

function is_cached(image: GalleryImage) {
  const img = new Image();
  img.src = image.src;
  img.srcset = image.srcset;
  img.sizes = image.sizes;
  return img.complete;
}

export default function ImageComponent(props: { image: GalleryImage }) {
  const { image } = props;
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- we want this not to change, only transition if there is no cache
  const cached = useMemo(() => is_cached(image), []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img
        src={image.src}
        srcSet={image.srcset}
        sizes={image.sizes}
        onLoad={() => setLoading(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: loading ? 0 : 1,
          transition: cached ? "none" : "opacity 1s ease-in-out",
          zIndex: 10,
        }}
        width="100%"
        height="100%"
      />
      {image.blurhash ? (
        <img
          src={`data:image/png;base64, ${image.blurhash}`}
          width="100%"
          height="100%"
        />
      ) : (
        <div
          style={{ width: "100%", height: "100%", background: "grey" }}
        ></div>
      )}
    </div>
  );
}
