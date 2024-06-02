import { useCallback, useContext, useEffect, useState } from "react";
import { spotifyAPI, spotifyAxios } from "../../api/spotifyAxios";
import { AlbumGroup, PaginatedRequestMode } from "../../utils/enums";
import { TokenContext } from "../../context/tokenContext";
import { ArtistAlbumParams } from "../../utils/interfaces";

interface AlbumConfig {
  total: number;
  previousUrl: string | null;
  nextUrl: string | null;
}

function useArtistAlbums(artistId: string, limit: number) {
  const [albums, setAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [albumConfig, setAlbumConfig] = useState<AlbumConfig | null>(null);
  const token = useContext(TokenContext);

  useEffect(() => {
    console.log("albums now", albums);
  }, [albums]);

  useEffect(() => {
    console.log("next now", albumConfig?.nextUrl);
  }, [albumConfig]);

  const requestAlbums = useCallback(
    async (params: ArtistAlbumParams) => {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const res = await spotifyAPI.getArtistAlbums(artistId, params, token);
        setAlbums(res.items);

        const config = {
          total: res.total,
          previousUrl: res.previous,
          nextUrl: res.next,
        };
        setAlbumConfig(config);
        console.log(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    },
    [artistId, token]
  );

  const requestPaginated = useCallback(
    async (direction: PaginatedRequestMode) => {
      
      setIsLoading(true);

      const url =
        direction === PaginatedRequestMode.Next
          ? albumConfig?.nextUrl
          : albumConfig?.previousUrl;

      if (!artistId || !url) return;

      try {
        const res = await spotifyAxios(
          token
        ).get<SpotifyApi.ArtistsAlbumsResponse>(url);
        setAlbums((prevAlbums) => {
          if (prevAlbums) return [...prevAlbums, ...res.data.items];
          else return res.data.items;
        });

        const newConfig = {
          total: res.data.total,
          previousUrl: res.data.previous,
          nextUrl: res.data.next,
        };

        setAlbumConfig(newConfig);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(true);
      }
    },
    [albumConfig, artistId, token]
  );

  useEffect(() => {
    const params: ArtistAlbumParams = {
      include_groups: [AlbumGroup.All],
      limit: limit,
      offset: 0,
    };
    requestAlbums(params);
  }, [requestAlbums, limit]);

  return [albums, isLoading, requestPaginated] as const;
}

export default useArtistAlbums;
