import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import ImageSkeleton from "./Skeleton/ImageSkeleton";

const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithRef<"img">>(
  function Image({ className, onLoad, loading, width, height, ...rest }, ref) {
    const [isLoading, setIsLoading] = useState(true);
    const [isInView, setIsInView] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (loading === "eager") {
        setIsInView(true);
        return;
      }

      let observerRefValue = null;
      const observer = new IntersectionObserver((entries, obs) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.unobserve(entry.target);
        }
      });

      if (targetRef.current) {
        observer.observe(targetRef.current);
        observerRefValue = targetRef.current;
      }

      return () => {
        if (observerRefValue) {
          observer.unobserve(observerRefValue);
        }
      };
    }, [loading]);

    return (
      <div
        ref={targetRef}
        style={{ width: width, height: height }}
        >
        <ImageSkeleton
          className={`${isLoading ? "block" : "hidden"} ${className}`}
        />
        {isInView && (
          <>
            <img
              className={`${className} ${isLoading ? "hidden" : "block"} object-cover`}
              onLoad={(ev) => {
                setIsLoading(false);
                onLoad?.(ev);
              }}
              ref={ref}
              width={width}
              height={height}
              {...rest}
            ></img>
          </>
        )}
      </div>
    );
  }
);

export default Image;
