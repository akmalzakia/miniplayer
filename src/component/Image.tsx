import React, { useState } from "react";
import ImageSkeleton from "./Skeleton/ImageSkeleton";

function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <ImageSkeleton
        className={`${isLoading ? "block" : "hidden"} ${props.className}`}
      />
      <img
        className={`${props.className} ${isLoading ? "hidden" : "block"}`}
        src={props.src}
        onLoad={() => setIsLoading(false)}
      ></img>
    </>
  );
}

export default Image;
