import usePlayerContext from "../../hooks/Context/usePlayerContext";
import Button from "./Button";
import { isArtist } from "../../utils/matchers";
import PlayWarningModal from "../Modals/PlayWarningModal";
import useModalContext from "../../hooks/Context/useModalContext";
import { FaPause, FaPlay } from "react-icons/fa6";

interface Props {
  playableObjects:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified
    | SpotifyApi.AlbumObjectFull;
  className?: string;
}

function MajorPlayButton({ playableObjects, className }: Props) {
  const { currentContext } = usePlayerContext();
  const { playerDispatcher } = usePlayerContext();

  const { openModal } = useModalContext();
  const isTrackOnCollection =
    !!currentContext?.context?.uri &&
    currentContext.context.uri === playableObjects.uri;

  return (
    <Button
      className={`p-[1rem] ${className} hover:p-[1.1rem] hover:-m-[0.1rem]`}
      onClick={(e) => {
        e.stopPropagation();
        if (!currentContext) {
          openModal(
            <PlayWarningModal
              transferPlayback={playerDispatcher.transferPlayback}
            />
          );
          return;
        }

        if (!currentContext?.paused && isTrackOnCollection) {
          playerDispatcher.pause();
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
        <FaPause className={`text-black text-xl`}></FaPause>
      ) : (
        <FaPlay className={`text-black text-xl`}></FaPlay>
      )}
    </Button>
  );
}

export default MajorPlayButton;
