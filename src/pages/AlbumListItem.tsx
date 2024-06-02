import { FiPause, FiPlay } from "react-icons/fi";
import Button from "../component/Button";
import utils from "../utils/util";
import { useEffect } from "react";
import useAlbumTracks from "../hooks/useAlbumTracks";
import TrackList from "./templates/Collections/components/TrackList";
import { CollectionType } from "../utils/enums";
import usePlayerContext from "../hooks/usePlayerContext";

interface Props {
  album: SpotifyApi.AlbumObjectSimplified;
}

function AlbumListItem({ album }: Props) {
  const [tracks, isTracksLoading] = useAlbumTracks(album.id);
  const { playerDispatcher, currentContext } = usePlayerContext();

  const isTrackOnCollection =
    tracks && tracks.some((i) => i.uri === currentContext?.current_track?.uri);

  const isPlayedInAnotherDevice = !!currentContext?.device;

  return (
    <div className='my-10'>
      <div className='flex gap-5 mb-5'>
        <div className='w-32'>
          <img
            className='max-w-full max-h-full rounded-md shadow-md'
            src={album.images[0].url}
          ></img>
        </div>
        <div className='flex-1 flex flex-col justify-between'>
          <div>
            <div className='font-bold text-ellipsis line-clamp-2 text-xl'>
              {album?.name}
            </div>
            <div className='text-sm text-spotify-gray flex gap-1'>
              <div>{utils.upperFirstLetter(album.album_group)}</div>
              <div>&#xb7;</div>
              <div>{album.release_date.split("-")[0]}</div>
              <div>&#xb7;</div>
              <div>{album.total_tracks} songs</div>
            </div>
          </div>
          <Button
            className='p-2 mt-2 self-start'
            onClick={() => {
              if (!currentContext?.paused && isTrackOnCollection) {
                if (isPlayedInAnotherDevice) {
                  playerDispatcher.transferPlayback();
                } else {
                  playerDispatcher.pause();
                }
              } else {
                playerDispatcher.playCollection(
                  album,
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
      </div>
      {tracks && (
        <TrackList
          type={CollectionType.Album}
          tracks={tracks}
          collectionUri={album.uri}
          currentTrackUri={currentContext?.current_track?.uri || ""}
          isPlaying={!currentContext?.paused}
        />
      )}
    </div>
  );
}

export default AlbumListItem;
