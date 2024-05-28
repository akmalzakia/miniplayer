import { createContext, useContext, useEffect, useState } from "react";
import { TokenContext } from "./tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";
import { UserContextType } from "../utils/interfaces";



export const UserContext = createContext<UserContextType | null>(null);

interface Props {
  children?: React.ReactNode;
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestUser() {
      console.log("requesting user data...");

      try {
        const data = await spotifyAPI.getCurrentUser(token);
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
