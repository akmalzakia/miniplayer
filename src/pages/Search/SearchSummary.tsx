import { useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../../api/spotifyAxios";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/tokenContext";
import GridDisplay from "../../component/GridDisplay";
import { SpotifyObjectType } from "../../utils/enums";
import SimplifiedTrackList from "../Artist/components/SimplifiedTrackList";

function SearchSummary() {
  const { query } = useParams();
  const token = useContext(TokenContext);
  const [searchResult, setSearchResult] = useState<Omit<
    SpotifyApi.SearchResponse,
    "shows" | "episodes"
  > | null>(null);

  useEffect(() => {
    async function fetchSearchQuery(query: string) {
      if (!query) return;
      try {
        const res = await spotifyAPI.search(
          {
            query,
            type: ["album", "artist", "playlist", "track"],
            limit: 10,
          },
          token
        );
        setSearchResult(res);
      } catch (error) {
        console.log(error);
      }
    }

    if (!query) return;

    fetchSearchQuery(query);
  }, [query, token]);

  return (
    searchResult && (
      <>
        {searchResult.tracks && (
          <>
            <div className='text-2xl font-bold mb-2'>Songs</div>
            <SimplifiedTrackList
              tracks={searchResult.tracks.items}
              expandable={{ enabled: false, preview: 4 }}
              isNumbered={false}
              showArtist={true}
            />
          </>
        )}
        {searchResult.artists && (
          <GridDisplay
            title='Artists'
            data={searchResult.artists.items}
            type={SpotifyObjectType.Artist}
            lazy
          />
        )}
        {searchResult.albums && (
          <GridDisplay
            title='Albums'
            data={searchResult.albums.items}
            type={SpotifyObjectType.Album}
            lazy
          />
        )}
        {searchResult.playlists && (
          <GridDisplay
            title='Playlists'
            data={searchResult.playlists.items}
            type={SpotifyObjectType.Playlist}
            lazy
          />
        )}
      </>
    )
  );
}

export default SearchSummary;
