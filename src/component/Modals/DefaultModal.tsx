import { useLayoutEffect, useRef, useState } from "react";
import Button from "../Buttons/Button";
import useModalContext from "../../hooks/Context/useModalContext";

interface ModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

function DefaultModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ModalProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useModalContext();

  useLayoutEffect(() => {
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
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
      <div className='text-center text-xl mb-10'>{title}</div>
      <div className='text-center text-base mb-10'>{description}</div>
      <div className='flex justify-around'>
        <Button
          className='border'
          onClick={() => {
            closeModal();
            onConfirm?.();
          }}
        >
          {confirmText}
        </Button>
        <Button
          className='border !bg-black'
          onClick={closeModal}
        >
          {cancelText}
        </Button>
      </div>
    </div>
  );
}

export default DefaultModal;
