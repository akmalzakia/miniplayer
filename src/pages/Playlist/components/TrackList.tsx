import { useState } from "react";
import { usePlayerContext } from "../../../context/playerContext";
import { formatTimeMinSecond } from "../../../utils/util";
import { FiPause, FiPlay } from "react-icons/fi";

interface Props {
  tracks: SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>;
  currentTrackUri: string;
  isPlaying: boolean;
  onPause(): void;
  onPlay(uri: string): void;
}

function TrackList({
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
          <th className='font-normal w-1/3'>Title</th>
          <th className='font-normal w-1/3'>Album</th>
          <th className='py-1 pr-2 font-normal'>Date Added</th>
          <th className='font-normal'>Duration</th>
        </tr>
      </thead>
      <tbody>
        {tracks.items.map((item, idx) => (
          <tr
            key={item.track?.id}
            className={`hover:bg-slate-800 ${
              isTrackPlayed(item.track?.uri)
                ? "border border-spotify-green"
                : ""
            }`}
            onMouseEnter={() => {
              setCurrentHover(item.track?.id || "");
            }}
            onMouseLeave={() => {
              setCurrentHover("");
            }}
          >
            <td
              className={`text-right px-3 ${
                isTrackPlayed(item.track?.uri) ? "text-spotify-green" : ""
              }`}
            >
              {isTrackPlayed(item.track?.uri) ? (
                isPlaying ? (
                  <FiPause onClick={pause} />
                ) : (
                  <FiPlay onClick={() => play(item.track?.uri)} />
                )
              ) : currentHover === item.track?.id ? (
                <FiPlay onClick={() => play(item.track?.uri)} />
              ) : (
                idx + 1
              )}
            </td>
            <td className='flex items-center py-2 gap-2'>
              <div className='w-10 min-w-10'>
                <img
                  className='max-w-full max-h-full rounded-md'
                  src={item.track?.album.images[0].url}
                />
              </div>
              <div>
                <div
                  className={`${
                    isTrackPlayed(item.track?.uri)
                      ? "text-spotify-green"
                      : "text-white"
                  }`}
                >
                  {item.track?.name}
                </div>
                <div className=''>
                  {item.track?.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </td>
            <td className='text-ellipsis overflow-hidden text-nowrap'>
              {item.track?.album.name}
            </td>
            <td className='pr-2'>{formatDateAdded(item.added_at)}</td>
            <td>{formatTimeMinSecond(item.track?.duration_ms)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TrackList;
