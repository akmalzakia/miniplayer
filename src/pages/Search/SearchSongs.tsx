import { useParams } from "react-router-dom";
import TrackList from "../templates/Collections/components/TrackList";
import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../context/tokenContext";
import { spotifyAPI } from "../../api/spotifyAxios";

function SearchSongs() {
  const { query } = useParams();
  const token = useContext(TokenContext);
  const [tracks, setTracks] =
    useState<SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull> | null>(null);

  useEffect(() => {
    async function fetchSongs(query: string) {
      const res = await spotifyAPI.search(
        {
          query,
          type: ["track"],
          limit: 20,
        },
        token
      );

      if (!res.tracks) return;

      setTracks(res.tracks);
    }

    if (!query) return;

    fetchSongs(query);
  }, [query, token]);

  return (
    <div>
      {tracks && (
        <TrackList
          tracks={tracks?.items}
          matchContext={false}
        />
      )}
    </div>
  );
}

export default SearchSongs;
