import { createContext, PropsWithChildren, useState } from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (node: React.ReactNode) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: PropsWithChildren) {
  const root = document.getElementById("root");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalElement, setModalElement] = useState<React.ReactNode | null>(
    null
  );

  function openModal(node: React.ReactNode) {
    setIsModalOpen(true);
    setModalElement(node);
  }

  function closeModal() {
    setIsModalOpen(false);
    setModalElement(null);
  }

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      <>
        {children}{" "}
        {root &&
          isModalOpen &&
          modalElement &&
          createPortal(modalElement, root)}
      </>
    </ModalContext.Provider>
  );
}
