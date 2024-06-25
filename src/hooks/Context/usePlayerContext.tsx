import { useContext } from "react";
import { PlayerContext } from "../../context/playerContext";

const usePlayerContext = () => {
  const obj = useContext(PlayerContext);
  if (!obj) {
    throw new Error("usePlayerContext must be used within a Provider");
  }
  return obj;
};

export default usePlayerContext