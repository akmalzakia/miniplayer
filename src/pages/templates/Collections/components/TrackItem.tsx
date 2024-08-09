import { Fragment, useMemo, useState } from "react";
import usePlayerContext from "../../../../hooks/Context/usePlayerContext";
import { FiPause, FiPlay } from "react-icons/fi";
import SpotifyImage from "../../../../component/SpotifyImage";
import { CollectionImageResolution } from "../../../../utils/enums";
import { isFullTrack, isPlaylistTrack } from "../../../../utils/matchers";
import { Link } from "react-router-dom";
import utils from "../../../../utils/util";

interface Props {
  item: SpotifyApi.TrackObjectSimplified | SpotifyApi.PlaylistTrackObject;
  idx: number;
  collectionUri?: string;
  matchContext?: boolean;
}

function TrackItem({ item, idx, collectionUri, matchContext }: Props) {
  const [isHover, setIsHover] = useState(false);
  const { playerDispatcher, currentContext, isActive } = usePlayerContext();
  const track = isPlaylistTrack(item) ? item.track : item;
  const isSameContext = matchContext
    ? collectionUri === currentContext?.context?.uri
    : true; // forcefully match the context for case when the context are unavailable e.g artist page / search

  const trackItem = useMemo(() => {
    if (isPlaylistTrack(item)) {
      return item.track;
    } else return item;
  }, [item]);

  const isPlayed =
    isActive &&
    currentContext?.current_track?.uri === track?.uri &&
    isSameContext;

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
      key={trackItem?.id}
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
              onClick={() =>
                playerDispatcher.playTrack(trackItem?.uri, collectionUri)
              }
            />
          )
        ) : isHover ? (
          <FiPlay
            className='m-auto'
            onClick={() =>
              playerDispatcher.playTrack(trackItem?.uri, collectionUri)
            }
          />
        ) : (
          <div className='pr-3'>{idx + 1}</div>
        )}
      </td>
      <td className='flex items-center py-2 gap-2'>
        {trackItem && isFullTrack(trackItem) && (
          <div className='w-10 min-w-10'>
            <SpotifyImage
              resolution={CollectionImageResolution.Low}
              className='max-w-full max-h-full rounded-md'
              images={trackItem.album.images}
              lazy
            />
          </div>
        )}
        <div>
          <div className={`${isPlayed ? "text-spotify-green" : "text-white"}`}>
            {trackItem?.name}
          </div>
          <div className='inline gap-1'>
            {trackItem?.artists.map((artist, idx) => {
              const separator = trackItem.artists.length > idx + 1 && <>, </>;
              return (
                <Fragment key={artist.id}>
                  <Link
                    className='hover:underline'
                    to={`/artist/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                  {separator}
                </Fragment>
              );
            })}
          </div>
        </div>
      </td>
      {trackItem && isFullTrack(trackItem) && (
        <>
          <td className='text-ellipsis overflow-hidden text-nowrap'>
            <Link
              to={`/album/${trackItem.album.id}`}
              className='hover:underline'
            >
              {trackItem.album.name}
            </Link>
          </td>
          {isPlaylistTrack(item) && (
            <td className='pr-2'>{formatDateAdded(item.added_at)}</td>
          )}
        </>
      )}
      <td className='rounded-r-md'>
        {utils.formatTimeMinSecond(trackItem?.duration_ms)}
      </td>
    </tr>
  );
}

export default TrackItem;
