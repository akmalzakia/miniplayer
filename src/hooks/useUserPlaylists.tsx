import { useContext, useEffect, useMemo, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";

function useUserPlaylists() {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestPlaylists() {
      console.log("requesting user playlists...");
      try {
        const params = {
          limit: 10,
          offset: 0,
        };
        const data = await spotifyAPI.getUserPlaylists(token, params);
        setPlaylists(data.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(true);
      }
    }

    if (!playlists || playlists.length === 0) {
      requestPlaylists();
      return;
    }

    setIsLoading(false);
  }, [token, playlists]);

  const cachedPlaylists = useMemo(() => playlists, [playlists]);

  return [cachedPlaylists, isLoading] as const;
}

export default useUserPlaylists;
