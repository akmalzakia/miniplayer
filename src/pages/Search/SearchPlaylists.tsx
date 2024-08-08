import { useRef } from "react";
import { useParams } from "react-router-dom";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";
import useInfiniteSearch from "../../hooks/useInfiniteSearch";

function SearchPlaylists() {
  const { query } = useParams();
  const triggerRef = useRef<HTMLDivElement>(null);
  const playlists = useInfiniteSearch<SpotifyApi.PlaylistObjectSimplified>(
    {
      query: query ?? "",
      type: "playlist",
      limit: 30,
    },
    triggerRef.current ?? undefined
  );

  return (
    <div>
      {playlists && (
        <GridDisplay
          data={playlists}
          type={SpotifyObjectType.Playlist}
          isMulti={true}
          lazy
        />
      )}
      <div
        className='w-px h-px'
        ref={triggerRef}
      ></div>
    </div>
  );
}

export default SearchPlaylists;
