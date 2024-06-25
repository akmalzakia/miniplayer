import { useContext } from "react";
import { ModalContext } from "../../context/modalContext";

const useModalContext = () => {
  const obj = useContext(ModalContext);
  if (!obj) {
    throw new Error("usePlayerContext must be used within a Provider");
  }
  return obj;
};

export default useModalContext