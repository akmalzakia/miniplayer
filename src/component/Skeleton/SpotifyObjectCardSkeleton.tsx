import DivSkeleton from "./DivSkeleton";
import ImageSkeleton from "./ImageSkeleton";

interface Props {
  imageOnly?: boolean;
  rounded?: boolean;
}

function SpotifyObjectCardSkeleton({ imageOnly, rounded }: Props) {
  return (
    <div className={`flex flex-col p-2 overflow-hidden rounded-sm gap-2`}>
      <ImageSkeleton className={`${rounded ? "rounded-full" : "rounded-md"}`} />
      {!imageOnly && (
        <>
          <DivSkeleton className='w-full h-4 rounded-lg'></DivSkeleton>
          <DivSkeleton className='w-1/2 h-[0.875rem] rounded-lg'></DivSkeleton>
        </>
      )}
    </div>
  );
}

export default SpotifyObjectCardSkeleton;
