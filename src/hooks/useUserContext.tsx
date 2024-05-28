import { useContext } from "react";
import { UserContext } from "../context/userContext";

const useUserContext = () => {
  const obj = useContext(UserContext);
  if (!obj) {
    throw new Error("useUserContext must be used within a Provider");
  }
  return obj;
};

export default useUserContext