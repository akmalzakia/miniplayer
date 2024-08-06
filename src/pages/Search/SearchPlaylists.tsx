import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/tokenContext";
import { spotifyAPI } from "../../api/spotifyAxios";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";

function SearchPlaylists() {
  const { query } = useParams();
  const token = useContext(TokenContext);
  const [playlists, setPlaylists] =
    useState<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified> | null>(
      null
    );

  useEffect(() => {
    async function fetchPlaylists(query: string) {
      try {
        const res = await spotifyAPI.search(
          {
            query,
            type: ["playlist"],
            limit: 30,
          },
          token
        );

        if (!res.playlists) return;

        setPlaylists(res.playlists);
      } catch (error) {
        console.log(error);
      }
    }

    if (!query) return;

    fetchPlaylists(query);
  }, [query, token]);

  return (
    <div>
      {playlists && (
        <GridDisplay
          data={playlists.items}
          type={SpotifyObjectType.Playlist}
          isMulti={true}
          lazy
        />
      )}
    </div>
  );
}

export default SearchPlaylists;
