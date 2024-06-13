import { useLayoutEffect, useRef, useState } from "react";
import Image from "./Image";
import { CollectionImageResolution } from "../utils/enums";

interface Props {
  className: string;
  images?: SpotifyApi.ImageObject[] | Spotify.Image[];
  priority?: "high" | "low" | "auto";
  resolution?: CollectionImageResolution;
  lazy?: boolean;
}

function SpotifyImage({
  className,
  images,
  priority,
  resolution,
  lazy,
}: Props) {
  const [width, setWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imageRef.current && !isLoading) {
      const rect = imageRef.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [isLoading]);

  function getOptimizedImage(
    images?: SpotifyApi.ImageObject[] | Spotify.Image[]
  ) {
    if (!images) return null;
    let optImage = images[0];
    let minWidthDiff = Number.MAX_VALUE;
    for (const x of images) {
      if (!x.width) break;
      const widthDiff = x.width - width;

      if (minWidthDiff > widthDiff && widthDiff > 0) {
        optImage = x;
        minWidthDiff = widthDiff;
      }
    }

    return optImage;
  }

  function getImageBySpecifiedResolution() {
    if (!images) return undefined;

    let image;
    if (images[2] && resolution === CollectionImageResolution.Low) {
      image = images[2];
    } else if (images[1] && resolution === CollectionImageResolution.Medium) {
      image = images[1];
    } else {
      image = images[0];
    }

    image.width = width;
    image.height = width;

    return image;
  }

  return (
    <Image
      className={className}
      src={getImageBySpecifiedResolution()?.url}
      height={getImageBySpecifiedResolution()?.height || undefined}
      width={getImageBySpecifiedResolution()?.width || undefined}
      onLoad={() => setIsLoading(false)}
      ref={imageRef}
      fetchPriority={priority}
      loading={lazy ? "lazy" : "eager"}
    ></Image>
  );
}

export default SpotifyImage;
