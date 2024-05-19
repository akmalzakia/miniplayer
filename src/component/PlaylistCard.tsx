import { useNavigate } from "react-router-dom";

interface Props extends React.PropsWithChildren {
  playlist: SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified;
  imageOnly?: boolean;
  className?: string;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

function PlaylistCard({
  playlist,
  imageOnly,
  className,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const id = `playlist-${playlist.id}`;
  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-col p-2 overflow-hidden hover:bg-slate-700 rounded-sm cursor-pointer ${
        className ?? ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        navigate(`/playlist/${playlist.id}`, { state: playlist });
      }}
    >
      <img
        id={`${id}-image`}
        className='max-w-full max-h-full'
        src={playlist.images[0].url}
      ></img>
      {!imageOnly && (
        <>
          <div className='font-bold text-md'>{playlist.name}</div>
          <div className='font-light text-sm text-ellipsis line-clamp-2'>
            {playlist.description}
          </div>
        </>
      )}
    </div>
  );
}

export default PlaylistCard;
