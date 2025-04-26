import { GalleryImage } from "./types/types";
import { useState } from "react";

export default function ImageComponent(props: { image: GalleryImage }) {
  const { image } = props;
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
          transition: "opacity 1s ease-in-out",
        }}
        width="100%"
        height="100%"
      />
    </div>
  );
}
