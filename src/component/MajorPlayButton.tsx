import { FiPause, FiPlay } from "react-icons/fi";
import useModalContext from "../hooks/useModalContext";
import usePlayerContext from "../hooks/usePlayerContext";
import Button from "./Button";
import { isArtist } from "../utils/matchers";
import PlayWarningModal from "./PlayWarningModal";

interface Props {
  collection:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified
    | SpotifyApi.AlbumObjectFull;
}

function MajorPlayButton({ collection }: Props) {
  const { openModal } = useModalContext();
  const { currentContext } = usePlayerContext();
  const { playerDispatcher } = usePlayerContext();

  const isPlayedInAnotherDevice = !!currentContext?.device;
  const isTrackOnCollection =
    !!currentContext?.context.uri &&
    currentContext.context.uri === collection.uri;
  return (
    <Button
      className='p-3'
      onClick={() => {
        if (!currentContext) {
          openModal(<PlayWarningModal />);
          return;
        }
        console.log(currentContext);
        if (!currentContext?.paused && isTrackOnCollection) {
          if (isPlayedInAnotherDevice) {
            playerDispatcher.transferPlayback();
          } else {
            playerDispatcher.pause();
          }
        } else {
          if (isArtist(collection)) {
            playerDispatcher.playArtist(
              collection.uri || "",
              isTrackOnCollection
            );
          } else {
            playerDispatcher.playCollection(
              collection,
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
