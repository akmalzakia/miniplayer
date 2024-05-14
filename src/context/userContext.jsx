import { createContext, useContext, useEffect, useState } from "react";
import { TokenContext } from "./tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";

export const UserContext = createContext("");

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestUser() {
      console.log("requesting user data...");

      try {
        const data = await spotifyAPI.getCurrentUser(token)
        console.log("user", data);
        setUser(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(true);
      }
    }

    if (!user) {
      requestUser();
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
