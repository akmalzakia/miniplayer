import { useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";
import { TokenContext } from "../../context/tokenContext";

function useRelatedArtists(artistId?: string) {
  const [relatedArtists, setRelatedArtists] = useState<
    SpotifyApi.ArtistObjectFull[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestRelatedArtists() {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getRelatedArtists(artistId, token);
        setRelatedArtists(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    requestRelatedArtists();
  }, [artistId, token]);

  return [relatedArtists, isLoading] as const;
}

export default useRelatedArtists;
