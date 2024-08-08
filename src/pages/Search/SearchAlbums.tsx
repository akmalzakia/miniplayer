import { useRef } from "react";
import { useParams } from "react-router-dom";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";
import useInfiniteSearch from "../../hooks/useInfiniteSearch";

function SearchAlbums() {
  const { query } = useParams();
  const triggerRef = useRef<HTMLDivElement>(null);
  const albums = useInfiniteSearch<SpotifyApi.AlbumObjectSimplified>(
    {
      query: query ?? "",
      type: "album",
      limit: 30,
    },
    triggerRef.current ?? undefined
  );

  return (
    <div>
      {albums && (
        <GridDisplay
          data={albums}
          type={SpotifyObjectType.Album}
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

export default SearchAlbums;
