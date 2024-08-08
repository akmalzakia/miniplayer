import { useRef } from "react";
import { useParams } from "react-router-dom";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";
import useInfiniteSearch from "../../hooks/useInfiniteSearch";

function SearchArtists() {
  const { query } = useParams();
  const triggerRef = useRef<HTMLDivElement>(null);
  const artists = useInfiniteSearch<SpotifyApi.ArtistObjectFull>(
    {
      query: query ?? "",
      type: "artist",
      limit: 30,
    },
    triggerRef.current ?? undefined
  );
  return (
    <div>
      {artists && (
        <GridDisplay
          data={artists}
          type={SpotifyObjectType.Artist}
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

export default SearchArtists;
