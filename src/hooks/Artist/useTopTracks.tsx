import { useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";

function useTopTracks(token: string, artistId?: string) {
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.TrackObjectFull[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requestTopTracks() {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getArtistTopTracks(artistId, token);
        setTopTracks(res);
        console.log(res);
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