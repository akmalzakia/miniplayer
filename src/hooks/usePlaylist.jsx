import { useContext, useEffect, useMemo, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import { playlistBase } from "../api/base";

function usePlaylist(id) {
  const [playlist, setPlaylist] = useState(playlistBase);
  const [isLoading, setIsLoading] = useState(true)
  const token = useContext(TokenContext)

  useEffect(() => {
    async function requestPlaylist() {
      console.log("requesting playlist with id: ", id);
      try {
        const data = await spotifyAPI.getPlaylistWithId(id, token);
        setPlaylist(data);
        console.log(data)
        setIsLoading(false)
      } catch (err) {
        console.log("error fetching playlist id: ", id);
        setIsLoading(true)
      }
    }

    if (playlist?.id !== id) {
      requestPlaylist();
    }
  }, [playlist, token, id]);

  const cachedPlaylist = useMemo(() => playlist, [playlist])

  return [cachedPlaylist, isLoading];
}

export default usePlaylist;
