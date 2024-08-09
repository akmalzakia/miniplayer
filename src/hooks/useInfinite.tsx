import { useCallback, useContext, useEffect, useState } from "react";
import { TokenContext } from "../context/tokenContext";
import { spotifyAxios } from "../api/spotifyAxios";

function useInfinite<B, T extends SpotifyApi.PagingObject<B>>(
  queryFn: () => Promise<T>,
  triggerRef?: HTMLDivElement
) {
  const [data, setData] = useState<B[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [next, setNext] = useState("");
  const token = useContext(TokenContext);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await queryFn();
      setData(res.items);
      setNext(res.next || "");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [queryFn]);

  const fetchMoreData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await spotifyAxios(token).get<SpotifyApi.PagingObject<B>>(
        next
      );
      setData((data) => {
        if (data) {
          return [...data, ...res.data.items];
        } else return res.data.items;
      });

      setNext(res.data.next || "");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [token, isLoading, next]);

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

export default useInfinite;
