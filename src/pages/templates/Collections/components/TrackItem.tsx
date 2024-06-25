import { useState } from "react";
import usePlayerContext from "../../../../hooks/Context/usePlayerContext";
import { FiPause, FiPlay } from "react-icons/fi";
import SpotifyImage from "../../../../component/SpotifyImage";
import { CollectionImageResolution } from "../../../../utils/enums";
import { isPlaylistTrack } from "../../../../utils/matchers";
import { Link } from "react-router-dom";
import utils from "../../../../utils/util";
import useModalContext from "../../../../hooks/Context/useModalContext";
import PlayWarningModal from "../../../../component/Modals/PlayWarningModal";

interface Props {
  item: SpotifyApi.TrackObjectSimplified | SpotifyApi.PlaylistTrackObject;
  idx: number;
  collectionUri: string;
}

function TrackItem({ item, idx, collectionUri }: Props) {
  const [isHover, setIsHover] = useState(false);
  const { openModal } = useModalContext();
  const { playerDispatcher, currentContext, isActive } = usePlayerContext();
  const track = isPlaylistTrack(item) ? item.track : item;
  const isSameContext = collectionUri === currentContext?.context.uri;

  const isPlayed =
    isActive &&
    currentContext?.current_track?.uri === track?.uri &&
    isSameContext;
  function play(trackUri?: string) {
    if (!trackUri) return;

    if (!currentContext) {
      openModal(<PlayWarningModal />);
      return;
    }

    playerDispatcher.playCollectionTrack(collectionUri, trackUri);
  }

  function pause() {
    playerDispatcher.pause();
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
    <tr
      key={track?.id}
      className={`hover:bg-spotify-hover ${
        isPlayed ? "border border-spotify-green" : ""
      }`}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <td
        className={`text-right rounded-l-md ${
          isPlayed ? "text-spotify-green" : ""
        }`}
      >
        {isPlayed ? (
          !currentContext?.paused ? (
            <FiPause
              className='m-auto'
              onClick={pause}
            />
          ) : (
            <FiPlay
              className='m-auto'
              onClick={() => play(track?.uri)}
            />
          )
        ) : isHover ? (
          <FiPlay
            className='m-auto'
            onClick={() => play(track?.uri)}
          />
        ) : (
          <div className='pr-3'>{idx + 1}</div>
        )}
      </td>
      <td className='flex items-center py-2 gap-2'>
        {isPlaylistTrack(item) && (
          <div className='w-10 min-w-10'>
            <SpotifyImage
              resolution={CollectionImageResolution.Low}
              className='max-w-full max-h-full rounded-md'
              images={item?.track?.album.images}
              lazy
            />
          </div>
        )}
        <div>
          <div className={`${isPlayed ? "text-spotify-green" : "text-white"}`}>
            {track?.name}
          </div>
          <div className='flex gap-1'>
            {track?.artists.map((artist, idx) => {
              const separator = track.artists.length > idx + 1 && <>, </>;
              return (
                <div key={artist.id}>
                  <Link
                    className='hover:underline'
                    to={`/artist/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                  {separator}
                </div>
              );
            })}
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
      <td className='rounded-r-md'>
        {utils.formatTimeMinSecond(track?.duration_ms)}
      </td>
    </tr>
  );
}

export default TrackItem;
