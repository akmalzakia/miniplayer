import { useContext, useEffect, useMemo, useState } from "react";
import { TokenContext } from "../context/tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";

function useAlbumTracks(id: string) {
  const [tracks, setTracks] = useState<
    SpotifyApi.TrackObjectSimplified[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestTracks() {
      console.log("requesting album tracks with id :", id);
      setIsLoading(true);
      try {
        const res = await spotifyAPI.getAlbumTracks(id, token);
        setTracks(res.items);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    requestTracks();
  }, [id, token]);

  const cachedTracks = useMemo(() => tracks, [tracks]);

  return [cachedTracks, isLoading] as const;
}

export default useAlbumTracks;
