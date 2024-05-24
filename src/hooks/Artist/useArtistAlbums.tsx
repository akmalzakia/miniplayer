import { useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";
import { AlbumGroup } from "../../utils/enums";

function useArtistAlbums(token: string, artistId?: string) {
  const [albums, setAlbums] = useState<SpotifyApi.ArtistsAlbumsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requestAlbums() {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const params = {
          include_groups: [AlbumGroup.Album, AlbumGroup.Single],
          limit: 10,
          offset: 0,
        };
        const res = await spotifyAPI.getArtistAlbums(artistId, params, token);
        setAlbums(res);
        console.log(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    }

    requestAlbums();
  }, [artistId, token]);

  return [albums, isLoading] as const;
}

export default useArtistAlbums;
