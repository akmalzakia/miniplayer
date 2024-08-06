import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/tokenContext";
import { spotifyAPI } from "../../api/spotifyAxios";
import SingleDisplay from "../../component/SingleDisplay";
import { SpotifyObjectType } from "../../utils/enums";

function SearchArtists() {
  const { query } = useParams();
  const token = useContext(TokenContext);
  const [artists, setArtists] =
    useState<SpotifyApi.PagingObject<SpotifyApi.ArtistObjectFull> | null>(null);

  useEffect(() => {
    async function fetchArtists(query: string) {
      try {
        const res = await spotifyAPI.search(
          {
            query,
            type: ["artist"],
            limit: 30,
          },
          token
        );

        if (!res.artists) return;

        setArtists(res.artists);
      } catch (error) {
        console.log(error);
      }
    }

    if (!query) return;

    fetchArtists(query);
  }, [query, token]);

  return (
    <div>
      {artists && (
        <SingleDisplay
          data={artists.items}
          type={SpotifyObjectType.Artist}
          isMulti={true}
          lazy
        />
      )}
    </div>
  );
}

export default SearchArtists;
