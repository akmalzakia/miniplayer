import { FiPause, FiPlay } from "react-icons/fi";
import usePlayerContext from "../../hooks/Context/usePlayerContext";
import Button from "./Button";
import { isArtist } from "../../utils/matchers";
import PlayWarningModal from "../Modals/PlayWarningModal";
import useModalContext from "../../hooks/Context/useModalContext";

interface Props {
  playableObjects:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified
    | SpotifyApi.AlbumObjectFull;
}

function MajorPlayButton({ playableObjects }: Props) {
  const { currentContext } = usePlayerContext();
  const { playerDispatcher } = usePlayerContext();

  const { openModal } = useModalContext();
  const isPlayedInAnotherDevice = !!currentContext?.device;
  const isTrackOnCollection =
    !!currentContext?.context.uri &&
    currentContext.context.uri === playableObjects.uri;
  return (
    <Button
      className='p-3'
      onClick={async () => {
        if (!currentContext) {
          openModal(
            <PlayWarningModal
              transferPlayback={playerDispatcher.transferPlayback}
            />
          );
          return;
        }

        if (!currentContext?.paused && isTrackOnCollection) {
          if (isPlayedInAnotherDevice) {
            playerDispatcher.transferPlayback();
          } else {
            playerDispatcher.pause();
          }
        } else {
          if (isArtist(playableObjects)) {
            playerDispatcher.playArtist(
              playableObjects.uri || "",
              isTrackOnCollection
            );
          } else {
            playerDispatcher.playCollection(
              playableObjects,
              isTrackOnCollection ?? false
            );
          }
        }
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
  );
}

export default MajorPlayButton;
