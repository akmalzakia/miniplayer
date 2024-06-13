import { useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";
import { TokenContext } from "../../context/tokenContext";

function useTopTracks(artistId?: string) {
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.TrackObjectFull[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext)

  useEffect(() => {
    async function requestTopTracks() {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getArtistTopTracks(artistId, token);
        setTopTracks(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    requestTopTracks();
  }, [artistId, token]);

  return [topTracks, isLoading] as const;
}

export default useTopTracks