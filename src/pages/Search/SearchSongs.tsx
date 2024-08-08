import { useParams } from "react-router-dom";
import TrackList from "../templates/Collections/components/TrackList";
import { useRef } from "react";
import useInfiniteSearch from "../../hooks/useInfiniteSearch";

function SearchSongs() {
  const { query } = useParams();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tracks = useInfiniteSearch<SpotifyApi.TrackObjectFull>(
    {
      query: query ?? "",
      type: "track",
      limit: 20,
    },
    triggerRef.current ?? undefined
  );

  return (
    <div>
      {tracks && (
        <TrackList
          tracks={tracks}
          matchContext={false}
        />
      )}
      <div
        className='w-px h-px'
        ref={triggerRef}
      ></div>
    </div>
  );
}

export default SearchSongs;
