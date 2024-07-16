import { useParams } from "react-router-dom";
import useArtistAlbums from "../../hooks/Artist/useArtistAlbums";
import { PaginatedRequestMode } from "../../utils/enums";
import { useCallback, useEffect, useRef, useState } from "react";
import AlbumListItem from "./AlbumListItem";
import MajorPlayButton from "../../component/Buttons/MajorPlayButton";
import { createPortal } from "react-dom";

function AlbumList() {
  const portal = document.getElementById("topbar-content-wrapper");
  const { id: artistId } = useParams();
  const [albums, isAlbumsLoading, requestPaginated] = useArtistAlbums(
    artistId || "",
    5
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentAlbum, setCurrentAlbum] =
    useState<SpotifyApi.AlbumObjectSimplified | null>(null);
  const loaderRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      {portal &&
        currentAlbum &&
        createPortal(
          <div
            ref={contentRef}
            className={`flex invisible gap-4`}
          >
            <div>
              <MajorPlayButton playableObjects={currentAlbum}></MajorPlayButton>
            </div>
            <b className='text-xl my-auto'>{currentAlbum.name}</b>
          </div>,
          portal
        )}
      {albums?.map((album) => (
        <AlbumListItem
          album={album}
          key={album.id}
          onHeaderAbove={() => {
            setCurrentAlbum(null);
            contentRef.current?.classList.add("invisible");
          }}
          onTrackAbove={() => {
            setCurrentAlbum(album);
            contentRef.current?.classList.remove("invisible");
          }}
        />
      ))}
      <div ref={loaderRef}></div>
    </>
  );
}

export default AlbumList;
