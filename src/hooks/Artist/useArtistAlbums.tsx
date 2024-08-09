import { useCallback, useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";
import { AlbumGroup } from "../../utils/enums";
import { TokenContext } from "../../context/tokenContext";
import { ArtistAlbumParams } from "../../utils/interfaces";

function useArtistAlbums(artistId: string, limit: number) {
  const [albums, setAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  const requestAlbums = useCallback(
    async (params: ArtistAlbumParams) => {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getArtistAlbums(artistId, params, token);
        setAlbums(res.items);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    },
    [artistId, token]
  );

  useEffect(() => {
    const params: ArtistAlbumParams = {
      include_groups: [AlbumGroup.All],
      limit: limit,
      offset: 0,
    };
    requestAlbums(params);
  }, [requestAlbums, limit]);

  return [albums, isLoading] as const;
}

export default useArtistAlbums;
