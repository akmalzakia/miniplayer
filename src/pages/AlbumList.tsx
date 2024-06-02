import { useParams } from "react-router-dom";
import useArtistAlbums from "../hooks/Artist/useArtistAlbums";
import { PaginatedRequestMode } from "../utils/enums";
import { useCallback, useEffect, useRef, useState } from "react";
import AlbumListItem from "./AlbumListItem";

function AlbumList() {
  const { id: artistId } = useParams();
  const [albums, isAlbumsLoading, requestPaginated] = useArtistAlbums(
    artistId || "",
    5
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  const requestMoreData = useCallback(async () => {
    if (isAlbumsLoading && isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      await requestPaginated(PaginatedRequestMode.Next);
      setIsLoadingMore(false);
    } catch (error) {
      console.log(error);
      setIsLoadingMore(true);
    }
  }, [isAlbumsLoading, isLoadingMore, requestPaginated]);

  useEffect(() => {
    
    let observerRefValue = null;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        requestMoreData();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
      observerRefValue = loaderRef.current;
    }

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
  }, [requestMoreData]);

  return (
    <>
      {albums?.map((album) => (
        <AlbumListItem
          album={album}
          key={album.id}
        />
      ))}
      <div ref={loaderRef}></div>
    </>
  );
}

export default AlbumList;
