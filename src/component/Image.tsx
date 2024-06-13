import React, { forwardRef, useState } from "react";
import ImageSkeleton from "./Skeleton/ImageSkeleton";

const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithRef<"img">>(
  function Image({ className, onLoad, ...rest }, ref) {
    const [isLoading, setIsLoading] = useState(true);
    return (
      <>
        <ImageSkeleton
          className={`${isLoading ? "block" : "hidden"} ${className}`}
        />
        <img
          className={`${className} ${isLoading ? "hidden" : "block"}`}
          onLoad={(ev) => {
            setIsLoading(false);
            onLoad?.(ev);
          }}
          ref={ref}
          {...rest}
        ></img>
      </>
    );
  }
);

export default Image;
