import { useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import { playlistBase } from "../api/base";

function usePlaylist(id) {
  const [playlist, setPlaylist] = useState(playlistBase);
  const token = useContext(TokenContext)

  useEffect(() => {
    async function requestPlaylist() {
      console.log("requesting playlist with id: ", id);
      try {
        const data = await spotifyAPI.getPlaylistWithId(id, token);
        setPlaylist(data);
        console.log(data)
      } catch (err) {
        console.log("error fetching playlist id: ", id);
      }
    }

    if (playlist?.id !== id) {
      requestPlaylist();
    }
  }, [playlist, token, id]);

  return playlist;
}

export default usePlaylist;
