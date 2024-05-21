import { useState } from "react";
import { usePlayerContext } from "../../../../context/playerContext";
import { formatTimeMinSecond } from "../../../../utils/util";
import { FiPause, FiPlay } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CollectionType } from "../../../../utils/enums";

interface Props {
  type: CollectionType;
  tracks:
    | SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>
    | SpotifyApi.PagingObject<SpotifyApi.TrackObjectSimplified>;
  currentTrackUri: string;
  isPlaying: boolean;
  onPause(): void;
  onPlay(uri: string): void;
}

function TrackList({
  type,
  tracks,
  currentTrackUri,
  isPlaying,
  onPause,
  onPlay,
}: Props) {
  const { isActive } = usePlayerContext();
  const [currentHover, setCurrentHover] = useState("");

  const isTrackPlayed = (trackId?: string) =>
    isActive && currentTrackUri === trackId;

  function isPlaylistTrack(
    item: SpotifyApi.TrackObjectSimplified | SpotifyApi.PlaylistTrackObject
  ): item is SpotifyApi.PlaylistTrackObject {
    return (item as SpotifyApi.PlaylistTrackObject).track !== undefined;
  }

  function play(trackUri?: string) {
    if (!trackUri) return;
    onPlay(trackUri);
  }

  function pause() {
    onPause();
  }

  function formatDateAdded(datetime?: string) {
    if (!datetime) return;

    const date = new Date(datetime.split("T")[0]);
    const dateDifference = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    const monthDifference = Math.floor(dateDifference / 30);
    const yearDifference = Math.floor(monthDifference / 12);

    if (yearDifference) {
      return `${yearDifference > 1 ? yearDifference + "years" : "a year"} ago`;
    } else if (monthDifference) {
      return `${
        monthDifference > 1 ? monthDifference + " months" : "a month"
      } ago`;
    } else {
      return `${dateDifference > 1 ? dateDifference + " days" : "a day"} ago`;
    }
  }

  return (
    <table className='table-fixed w-full text-sm text-gray-400'>
      <thead className='border-b border-gray-500'>
        <tr className='text-left'>
          <th className='text-right pr-3 font-normal w-8'>#</th>
          <th className='font-normal'>Title</th>
          {type === CollectionType.Playlist && (
            <>
              <th className='font-normal w-1/3'>Album</th>
              <th className='py-1 pr-2 font-normal w-32'>Date Added</th>
            </>
          )}
          <th className='font-normal w-20'>Duration</th>
        </tr>
      </thead>
      <tbody>
        {tracks.items.map((item, idx) => {
          const trackItem = isPlaylistTrack(item) ? item.track : item;
          return (
            <tr
              key={trackItem?.id}
              className={`hover:bg-slate-800 ${
                isTrackPlayed(trackItem?.uri)
                  ? "border border-spotify-green"
                  : ""
              }`}
              onMouseEnter={() => {
                setCurrentHover(trackItem?.id || "");
              }}
              onMouseLeave={() => {
                setCurrentHover("");
              }}
            >
              <td
                className={`text-right px-3 ${
                  isTrackPlayed(trackItem?.uri) ? "text-spotify-green" : ""
                }`}
              >
                {isTrackPlayed(trackItem?.uri) ? (
                  isPlaying ? (
                    <FiPause onClick={pause} />
                  ) : (
                    <FiPlay onClick={() => play(trackItem?.uri)} />
                  )
                ) : currentHover === trackItem?.id ? (
                  <FiPlay onClick={() => play(trackItem?.uri)} />
                ) : (
                  idx + 1
                )}
              </td>
              <td className='flex items-center py-2 gap-2'>
                {isPlaylistTrack(item) && (
                  <div className='w-10 min-w-10'>
                    <img
                      className='max-w-full max-h-full rounded-md'
                      src={item.track?.album.images[0].url}
                    />
                  </div>
                )}
                <div>
                  <div
                    className={`${
                      isTrackPlayed(trackItem?.uri)
                        ? "text-spotify-green"
                        : "text-white"
                    }`}
                  >
                    {trackItem?.name}
                  </div>
                  <div className=''>
                    {trackItem?.artists.map((artist) => artist.name).join(", ")}
                  </div>
                </div>
              </td>
              {isPlaylistTrack(item) && (
                <>
                  <td className='text-ellipsis overflow-hidden text-nowrap'>
                    <Link
                      to={`/album/${item.track?.album.id}`}
                      className='hover:underline'
                    >
                      {item.track?.album.name}
                    </Link>
                  </td>
                  <td className='pr-2'>{formatDateAdded(item.added_at)}</td>
                </>
              )}
              <td>{formatTimeMinSecond(trackItem?.duration_ms)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TrackList;