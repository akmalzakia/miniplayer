import DivSkeleton from "./DivSkeleton";

interface Props {
  rounded?: boolean;
  className?: string;
}

function ImageSkeleton({ className }: Props) {
  return (
    <DivSkeleton
      className={`max-w-full max-h-full w-full pb-[100%] ${className}`}
    ></DivSkeleton>
  );
}

export default ImageSkeleton;
