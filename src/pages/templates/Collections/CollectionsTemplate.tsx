import Button from "../../../component/Button";
import { FiPause, FiPlay } from "react-icons/fi";
import TrackList from "./components/TrackList";
import { CollectionType } from "../../../utils/enums";
import CollectionOwnerImage from "./components/CollectionOwnerImage";
import { Textfit } from "react-textfit";
import usePlayerContext from "../../../hooks/usePlayerContext";
import utils from "../../../utils/util";
import { isPlaylist, isPlaylistTrack } from "../../../utils/matchers";
import usePlayerStateFetcher from "../../../hooks/usePlayerStateFetcher";

interface Props {
  type: CollectionType;
  collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull | null;
}

function CollectionsTemplate({ type, collection }: Props) {
  const { playerDispatcher, currentContext } = usePlayerContext();

  const isTrackOnCollection =
    collection &&
    collection?.tracks.items.some((i) => {
      return isPlaylistTrack(i)
        ? i.track?.uri === currentContext?.current_track?.uri
        : i.uri === currentContext?.current_track?.uri;
    });

  const isPlayedInAnotherDevice = !!currentContext?.device;

  function calculateDuration(
    tracks:
      | SpotifyApi.PlaylistTrackObject[]
      | SpotifyApi.TrackObjectSimplified[]
  ) {
    if (!tracks) return;

    const totalDuration = tracks.reduce((acc, obj) => {
      if (isPlaylistTrack(obj)) {
        if (obj.track) {
          return acc + obj.track.duration_ms;
        } else {
          return acc + 0;
        }
      } else {
        if (obj) {
          return acc + obj.duration_ms;
        } else {
          return acc + 0;
        }
      }
    }, 0);
    return totalDuration;
  }

  usePlayerStateFetcher(collection);

  function formatCollectionDuration(duration: number) {
    if (!duration) return;

    const timeDetails = utils.millisToMinutesAndSeconds(duration);
    let res = `${timeDetails.hours ? timeDetails.hours + " hr" : ""} `;
    res += `${timeDetails.minutes} min `;
    res += `${!timeDetails.hours ? timeDetails.seconds + " sec" : ""} `;

    return res;
  }

  return (
    collection && (
      <>
        <div className='w-full flex gap-2'>
          <div className='w-[30%] min-w-36 max-w-72'>
            <img
              className='max-w-full max-h-full rounded-md shadow-md'
              src={collection.images[0].url}
            ></img>
          </div>
          <div className='flex flex-col justify-end gap-2 w-[70%] min-w-[calc(100%-18rem)] max-w-[calc(100%-9rem)]'>
            {isPlaylist(collection) && (
              <div className=''>
                {collection.public ? "Public" : "Private"} Playlist
              </div>
            )}

            <div className='font-bold'>
              <Textfit
                mode='single'
                min={36}
                max={90}
              >
                {collection?.name}
              </Textfit>
            </div>

            <div className='text-spotify-gray mt-1'>
              {isPlaylist(collection) && collection.description}
            </div>
            <div className='flex text-spotify-gray items-center gap-1'>
              {
                <CollectionOwnerImage
                  type={type}
                  ownerId={
                    isPlaylist(collection)
                      ? collection.owner.id
                      : collection.artists[0].id
                  }
                />
              }
              <div className='font-bold text-white'>
                {isPlaylist(collection)
                  ? collection.owner.display_name
                  : collection.artists[0].name}
              </div>
              <div>&#xb7;</div>
              {isPlaylist(collection) &&
                collection.followers &&
                collection.followers.total !== 0 && (
                  <>
                    <div className=''>
                      {utils.formatFollowers(collection.followers.total)} likes
                    </div>
                    <div>&#xb7;</div>
                  </>
                )}
              <div className=''>
                {collection.tracks.total} songs,{" "}
                {formatCollectionDuration(
                  calculateDuration(collection.tracks.items) || 0
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex mt-4'>
          <Button
            className='p-3'
            onClick={() => {
              if (!currentContext?.paused && isTrackOnCollection) {
                if (isPlayedInAnotherDevice) {
                  playerDispatcher.transferPlayback();
                } else {
                  playerDispatcher.pause();
                }
              } else {
                playerDispatcher.playCollection(
                  collection,
                  isTrackOnCollection ?? false
                );
              }
              console.log(isPlayedInAnotherDevice);
            }}
          >
            {!currentContext?.paused && isTrackOnCollection ? (
              isPlayedInAnotherDevice ? (
                <>Playing on {currentContext?.device?.name}</>
              ) : (
                <FiPause className='text-xl'></FiPause>
              )
            ) : (
              <FiPlay className='text-xl'></FiPlay>
            )}
          </Button>
        </div>
        <TrackList
          type={type}
          tracks={collection.tracks.items}
          collectionUri={collection.uri}
          currentTrackUri={currentContext?.current_track?.uri || ""}
          isPlaying={!currentContext?.paused}
        ></TrackList>
      </>
    )
  );
}

export default CollectionsTemplate;
