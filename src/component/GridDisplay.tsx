import { Link } from "react-router-dom";
import useSingleColumnDisplay from "../hooks/useSingleColumnDisplay";
import { CollectionImageResolution, SpotifyObjectType } from "../utils/enums";
import SpotifyObjectCard from "./SpotifyObjectCard";
import SpotifyObjectCardSkeleton from "./Skeleton/SpotifyObjectCardSkeleton";

interface Props {
  title?: string;
  type: SpotifyObjectType;
  data:
    | SpotifyApi.AlbumObjectSimplified[]
    | SpotifyApi.ArtistObjectFull[]
    | SpotifyApi.PlaylistObjectSimplified[]
    | null;
  isLoading?: boolean;
  detailLink?: string;
  imagePriority?: "high" | "low" | "auto";
  lazy?: boolean;
  isMulti?: boolean;
}

function GridDisplay({
  title,
  type,
  data,
  isLoading,
  detailLink,
  imagePriority,
  lazy,
  isMulti,
}: Props) {
  const [columnSize, columnRef] = useSingleColumnDisplay(180);
  const isShowAllNeeded =
    detailLink && data?.length && data.length > columnSize;
  return (
    <div className='py-2'>
      {title && (
        <div className='flex justify-between'>
          <div className='font-bold text-xl'>{title}</div>
          {isShowAllNeeded && (
            <Link
              to={detailLink}
              className='font-bold text-spotify-gray text-sm'
            >
              Show all
            </Link>
          )}
        </div>
      )}
      <div
        className='grid -mx-2 mt-3'
        style={{
          gridTemplateColumns: `repeat(${columnSize}, minmax(10em, 1fr))`,
          gridTemplateRows: isMulti
            ? "repeat(auto-fill, minmax(10em, 1fr))"
            : undefined,
        }}
        ref={columnRef}
      >
        {isLoading
          ? [...Array(columnSize)].map((x, i) => (
              <SpotifyObjectCardSkeleton
                key={i}
                rounded={type === SpotifyObjectType.Artist}
              />
            ))
          : data?.map((item, idx) => {
              if (!isMulti && idx >= columnSize) return null;
              return (
                <SpotifyObjectCard
                  key={item.id}
                  type={type}
                  data={item}
                  rounded={type === SpotifyObjectType.Artist}
                  imageResolution={CollectionImageResolution.Medium}
                  imagePriority={imagePriority}
                  lazy={lazy}
                />
              );
            })}
      </div>
    </div>
  );
}

export default GridDisplay;
