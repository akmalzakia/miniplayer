import { useCallback, useContext, useEffect, useState } from "react";
import { spotifyAPI, spotifyAxios } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import { SearchParams } from "../utils/interfaces";

interface InfiniteSearchParams extends Omit<SearchParams, "type"> {
  type: "album" | "artist" | "playlist" | "track";
}

function useInfiniteSearch<
  T extends
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.AlbumObjectSimplified
>(
  { query, type, limit, offset }: InfiniteSearchParams,
  triggerRef?: HTMLDivElement
) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [next, setNext] = useState("");
  const token = useContext(TokenContext);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParams: SearchParams = { query, type: [type], limit, offset };
      const res = await spotifyAPI.search(searchParams, token);
      const object = res[`${type}s`];

      if (object) {
        setData(object.items as T[]);
        setNext(object.next || "");
      } else {
        setData(null);
        setNext("");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [query, type, limit, offset, token]);

  const fetchMoreData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await spotifyAxios(token).get<SpotifyApi.SearchResponse>(
        next
      );

      const object = res.data[`${type}s`];

      if (object) {
        setData((data) => {
          if (data) {
            return [...data, ...(object.items as T[])];
          } else return object.items as T[];
        });
        setNext(object.next || "");
      } else {
        setData(null);
        setNext("");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [isLoading, type, next, token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    let observerRef = null;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        if (next) {
          fetchMoreData();
        }
      }
    });

    if (triggerRef) {
      observer.observe(triggerRef);
      observerRef = triggerRef;
    }

    return () => {
      if (observerRef) {
        observer.unobserve(observerRef);
      }
    };
  }, [fetchInitialData, fetchMoreData, triggerRef, data, next]);

  return data;
}

export default useInfiniteSearch;
