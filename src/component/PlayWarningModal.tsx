import useModalContext from "../hooks/useModalContext";
import usePlayerContext from "../hooks/usePlayerContext";
import DefaultModal from "./DefaultModal";
import useUserContext from "../hooks/useUserContext";

function PlayWarningModal() {
  const { openModal } = useModalContext();
  const { playerDispatcher } = usePlayerContext();
  const { user } = useUserContext();

  return (
    <DefaultModal
      title='Warning!'
      description='No spotify instance found!'
      confirmText='Transfer Playback'
      onConfirm={() => {
        if (user?.product === "premium") {
          playerDispatcher.transferPlayback();
        } else {
          openModal(
            <DefaultModal
              title='Webplayer is unavailable!'
              description='WebPlayer is only available for Premium users! Meanwhile, you can play any music in your spotify client first and try clicking the button again!'
            />
          );
        }
      }}
    />
  );
}

export default PlayWarningModal;
