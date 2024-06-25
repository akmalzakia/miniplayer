import { useContext, useEffect, useMemo, useState } from "react";
import { TokenContext } from "../../context/tokenContext";
import { spotifyAPI } from "../../api/spotifyAxios";

function useArtist(id: string) {
  const [artist, setArtist] = useState<SpotifyApi.ArtistObjectFull | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestArtist() {
      console.log("requesting artist with id :", id);
      setIsLoading(true);
      try {
        const res = await spotifyAPI.getArtistById(id, token);
        setArtist(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    if (artist?.id !== id) {
      requestArtist();
    }
  }, [artist, id, token]);

  const cachedArtist = useMemo(() => artist, [artist]);

  return [cachedArtist, isLoading] as const;
}

export default useArtist;
