import { createContext, useContext, useEffect, useState } from "react";
import { TokenContext } from "./tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";
import { userBase } from "../api/base";

export const UserContext = createContext({ user: userBase, isLoading: true});

export function UserProvider({ children }) {
  const [user, setUser] = useState(userBase);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestUser() {
      console.log("requesting user data...");

      try {
        const data = await spotifyAPI.getCurrentUser(token)
        setUser(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(true);
      }
    }

    if (user === userBase) {
      requestUser();
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
