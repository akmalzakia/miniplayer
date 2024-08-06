import { createPortal } from "react-dom";
import SearchInput from "./components/SearchInput";
import { useContext } from "react";
import { TopbarContentContext } from "../../context/topbarContext";
import {
  generatePath,
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import FilterTags from "./components/FilterTags";

const baseUrl = "/search";

function Search() {
  const portal = useContext(TopbarContentContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { query } = useParams();

  const routes = [
    "/search/:q",
    "/search/:q/songs",
    "/search/:q/albums",
    "/search/:q/playlists",
    "/search/:q/artists",
  ];

  return (
    <>
      {portal &&
        createPortal(
          <SearchInput
            className='w-80 h-12'
            onDebouncedInput={(query) => {
              // try to use regex + string.replace next time...
              let path = "";
              if (!query) {
                path = baseUrl;
              } else {
                let pattern = routes.find((p) =>
                  matchPath(p, location.pathname)
                );
                if (!pattern) pattern = routes[0];
                path = generatePath(pattern, { q: query });
              }
              navigate(`${path}`, {
                replace: location.pathname === baseUrl,
              });
            }}
          />,
          portal
        )}
      {query && (
        <div className='px-4 py-2 flex gap-3 sticky top-0 bg-spotify-black z-10'>
          <FilterTags
            type='All'
            link={`/search/${query}`}
          />
          <FilterTags
            type='Songs'
            link={`/search/${query}/songs`}
          />
          <FilterTags
            type='Artists'
            link={`/search/${query}/artists`}
          />
          <FilterTags
            type='Playlists'
            link={`/search/${query}/playlists`}
          />
          <FilterTags
            type='Albums'
            link={`/search/${query}/albums`}
          />
        </div>
      )}
      <div className='mt-5 px-4'>
        <Outlet />
      </div>
    </>
  );
}

export default Search;
