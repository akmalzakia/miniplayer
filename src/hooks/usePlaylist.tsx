import { useContext, useEffect, useMemo, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";

function usePlaylist(id: string) {
  const [playlist, setPlaylist] =
    useState<SpotifyApi.PlaylistObjectFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestPlaylist() {
      console.log("requesting playlist with id: ", id);
      setIsLoading(true);
      try {
        const data = await spotifyAPI.getPlaylistWithId(id, token);
        setPlaylist(data);
        setIsLoading(false);
      } catch (err) {
        console.log("error fetching playlist id: ", id);
        setIsLoading(true);
      }
    }

    if (playlist?.id !== id) {
      requestPlaylist();
    }
  }, [playlist, token, id]);

  const cachedPlaylist = useMemo(() => playlist, [playlist]);

  return [cachedPlaylist, isLoading] as const;
}

export default usePlaylist;
