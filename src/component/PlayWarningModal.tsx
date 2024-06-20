import { useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import useModalContext from "../hooks/useModalContext";
import usePlayerContext from "../hooks/usePlayerContext";

function PlayWarningModal() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useModalContext();
  const { playerDispatcher } = usePlayerContext();

  useLayoutEffect(() => {
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    console.log(w);
    setWidth(w);
    setHeight(h);
  }, []);

  return (
    <div
      ref={modalRef}
      className='fixed w-96 p-4 rounded-xl bg-spotify-black shadow-md font-sans'
      style={{
        top: `calc(50% - ${height / 2}px)`,
        left: `calc(50% - ${width / 2}px)`,
      }}
    >
      <div className='text-center text-xl mb-10'>Warning!</div>
      <div className='text-center text-base mb-10'>
        No spotify instance found!
      </div>
      <div className='flex justify-around'>
        <Button
          className='border'
          onClick={() => {
            playerDispatcher.transferPlayback();
            closeModal();
          }}
        >
          Transfer Playback
        </Button>
        <Button
          className='border !bg-black'
          onClick={closeModal}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default PlayWarningModal;
