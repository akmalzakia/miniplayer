import { createPortal } from "react-dom";
import Input from "./components/SearchInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { TopbarContentContext } from "../../context/topbarContext";
import { spotifyAPI } from "../../api/spotifyAxios";
import { TokenContext } from "../../context/tokenContext";
import SimplifiedTrackList from "../Artist/components/SimplifiedTrackList";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Search() {
  const portal = useContext(TopbarContentContext);
  const token = useContext(TokenContext);
  const { query } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResult, setSearchResult] = useState<Omit<
    SpotifyApi.SearchResponse,
    "shows" | "episodes"
  > | null>(null);

  const fetchSearchQuery = useCallback(
    async (query: string) => {
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
    },
    [token]
  );

  useEffect(() => {
    if (!query) return;

    fetchSearchQuery(query);
  }, [query, fetchSearchQuery]);

  return (
    <>
      {portal &&
        createPortal(
          <Input
            className='w-80 h-12'
            onDebouncedInput={(query) => {
              navigate(`/search/${query}`, {
                replace: location.pathname === "/search",
              });
            }}
          />,
          portal
        )}
      {searchResult && (
        <div className='px-2 mt-10'>
          {searchResult.tracks && (
            <>
              <div className="text-2xl font-bold mb-2">Songs</div>
              <SimplifiedTrackList
                tracks={searchResult.tracks.items}
                expandable={{ enabled: false, preview: 4 }}
                isNumbered={false}
                showArtist={true}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Search;
