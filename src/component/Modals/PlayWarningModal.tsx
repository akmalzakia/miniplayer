import useModalContext from "../../hooks/Context/useModalContext";
import DefaultModal from "./DefaultModal";
import useUserContext from "../../hooks/Context/useUserContext";

interface Props {
  transferPlayback: () => Promise<void>;
}

function PlayWarningModal({ transferPlayback }: Props) {
  const { openModal } = useModalContext();
  const { user } = useUserContext();

  return (
    <DefaultModal
      title='Warning!'
      description='No spotify instance found!'
      confirmText='Transfer Playback'
      onConfirm={async () => {
        if (user?.product === "premium") {
          await transferPlayback();
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
