import { useParams } from "react-router-dom";
import { AlbumGroup } from "../../utils/enums";
import { useCallback, useContext, useRef, useState } from "react";
import AlbumListItem from "./AlbumListItem";
import MajorPlayButton from "../../component/Buttons/MajorPlayButton";
import { createPortal } from "react-dom";
import { TopbarContentContext } from "../../context/topbarContext";
import useInfinite from "../../hooks/useInfinite";
import { spotifyAPI } from "../../api/spotifyAxios";
import { TokenContext } from "../../context/tokenContext";

function AlbumList() {
  const portal = useContext(TopbarContentContext);
  const { id: artistId } = useParams();
  const triggerRef = useRef<HTMLDivElement>(null);
  const token = useContext(TokenContext);
  const [currentAlbum, setCurrentAlbum] =
    useState<SpotifyApi.AlbumObjectSimplified | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchAlbums = useCallback(async () => {
    return await spotifyAPI.getArtistAlbums(
      artistId || "",
      {
        include_groups: [AlbumGroup.All],
        limit: 5,
        offset: 0,
      },
      token
    );
  }, [artistId, token]);

  const albums = useInfinite<
    SpotifyApi.AlbumObjectSimplified,
    SpotifyApi.ArtistsAlbumsResponse
  >(fetchAlbums, triggerRef.current || undefined);

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
      <div ref={triggerRef}></div>
    </>
  );
}

export default AlbumList;
