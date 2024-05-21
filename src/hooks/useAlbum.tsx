import { useContext, useEffect, useMemo, useState } from "react";
import { TokenContext } from "../context/tokenContext";
import { spotifyAPI } from "../api/spotifyAxios";

function useAlbum(id: string) {
  const [album, setAlbum] = useState<SpotifyApi.AlbumObjectFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestAlbum() {
      console.log("requesting album with id :", id);
      setIsLoading(true);
      try {
        const res = await spotifyAPI.getAlbumWithId(id, token);
        setAlbum(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    if (album?.id !== id) {
      requestAlbum();
    }
  }, [album, id, token]);

  const cachedAlbum = useMemo(() => album, [album])

  return [cachedAlbum, isLoading] as const;
}

export default useAlbum;
