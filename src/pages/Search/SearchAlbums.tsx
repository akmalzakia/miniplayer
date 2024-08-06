import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/tokenContext";
import { spotifyAPI } from "../../api/spotifyAxios";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";

function SearchAlbums() {
  const { query } = useParams();
  const token = useContext(TokenContext);
  const [albums, setAlbums] =
    useState<SpotifyApi.PagingObject<SpotifyApi.AlbumObjectSimplified> | null>(
      null
    );

  useEffect(() => {
    async function fetchAlbums(query: string) {
      try {
        const res = await spotifyAPI.search(
          {
            query,
            type: ["album"],
            limit: 30,
          },
          token
        );

        if (!res.albums) return;

        setAlbums(res.albums);
      } catch (error) {
        console.log(error);
      }
    }

    if (!query) return;

    fetchAlbums(query);
  }, [query, token]);

  return (
    <div>
      {albums && (
        <GridDisplay
          data={albums.items}
          type={SpotifyObjectType.Album}
          isMulti={true}
          lazy
        />
      )}
    </div>
  );
}

export default SearchAlbums;
