import useSingleColumnDisplay from "../hooks/useSingleColumnDisplay";
import { SpotifyObjectType } from "../utils/enums";
import SpotifyObjectCard from "./SpotifyObjectCard";
import SpotifyObjectCardSkeleton from "./SpotifyObjectCardSkeleton";

interface Props {
  title: string;
  type: SpotifyObjectType;
  data:
    | SpotifyApi.AlbumObjectSimplified[]
    | SpotifyApi.ArtistObjectFull[]
    | SpotifyApi.PlaylistObjectSimplified[];
  isLoading?: boolean;
}

function SingleDisplay({ title, type, data, isLoading }: Props) {
  const [columnSize, columnRef] = useSingleColumnDisplay(180);
  return (
    <div className='py-2'>
      <div className='font-bold text-xl'>{title}</div>
      <div
        className='grid w-full -mx-2 mt-3'
        style={{
          gridTemplateColumns: `repeat(${columnSize}, minmax(10em, 1fr))`,
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
              if (idx >= columnSize) return null;
              return (
                <SpotifyObjectCard
                  key={item.id}
                  type={type}
                  data={item}
                  rounded={type === SpotifyObjectType.Artist}
                />
              );
            })}
      </div>
    </div>
  );
}

export default SingleDisplay;
