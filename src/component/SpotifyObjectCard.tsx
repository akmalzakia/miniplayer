import { useNavigate } from "react-router-dom";
import { SpotifyObjectType } from "../utils/enums";
import { upperFirstLetter } from "../utils/util";

interface Props extends React.PropsWithChildren {
  type: SpotifyObjectType;
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified;
  imageOnly?: boolean;
  rounded?: boolean;
  className?: string;
}

function SpotifyObjectCard({
  type,
  data,
  imageOnly,
  rounded,
  className
}: Props) {
  const navigate = useNavigate();

  function isPlaylist(
    data:
      | SpotifyApi.PlaylistObjectFull
      | SpotifyApi.PlaylistObjectSimplified
      | SpotifyApi.ArtistObjectFull
      | SpotifyApi.AlbumObjectSimplified
  ): data is SpotifyApi.PlaylistObjectFull {
    return (data as SpotifyApi.PlaylistObjectFull).type === "playlist";
  }

  function isAlbum(
    data:
      | SpotifyApi.PlaylistObjectFull
      | SpotifyApi.PlaylistObjectSimplified
      | SpotifyApi.ArtistObjectFull
      | SpotifyApi.AlbumObjectSimplified
  ): data is SpotifyApi.AlbumObjectSimplified {
    return (data as SpotifyApi.AlbumObjectSimplified).type === "album";
  }


  return (
    <div
      className={`flex flex-col p-2 overflow-hidden hover:bg-white hover:bg-opacity-5 rounded-sm cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        navigate(`/${type}/${data.id}`);
      }}
    >
      <img
        className={`max-w-full max-h-full aspect-square object-cover ${
          rounded ? "rounded-full" : "rounded-md"
        }`}
        src={data.images[0].url}
      ></img>
      {!imageOnly && (
        <>
          <div className='text-base text-nowrap overflow-hidden text-ellipsis font-sans'>
            {data.name}
          </div>
          {isPlaylist(data) ? (
            <div className='text-gray-400 text-sm text-ellipsis line-clamp-2'>
              {data.description}
            </div>
          ) : isAlbum(data) ? (
            <div className='flex gap-2 text-sm text-gray-400'>
              <div>{data.release_date.split("-")[0]}</div>
              <div>&#xb7;</div>
              <div>{upperFirstLetter(data.album_group)}</div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">{upperFirstLetter(data.type)}</div>
          )}
        </>
      )}
    </div>
  );
}

export default SpotifyObjectCard;
