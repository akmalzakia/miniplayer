import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Fragment, useContext, useEffect, useState } from "react";
import SpotifyObjectCardSkeleton from "./SpotifyObjectCardSkeleton";
import SpotifyObjectCard from "./SpotifyObjectCard";
import { SpotifyObjectType, TooltipPosition } from "../utils/enums";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import utils from "../utils/util";
import "overlayscrollbars/overlayscrollbars.css";
import Tooltip from "./Tooltip";

function SidebarPlaylistLibrary() {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useContext(TokenContext);

  useEffect(() => {
    async function requestPlaylists() {
      console.log("requesting user playlists...");
      try {
        const params = {
          limit: 10,
          offset: 0,
        };
        const data = await spotifyAPI.getUserPlaylists(token, params);
        setPlaylists(data.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(true);
      }
    }

    if (!playlists || playlists.length === 0) {
      requestPlaylists();
      return;
    }

    setIsLoading(false);
  }, [token, playlists]);
  return (
    <OverlayScrollbarsComponent
      className='gap-2 overlow-y h-3/4 p-2 bg-spotify-card rounded-md shadow-md'
      options={{
        scrollbars: { autoHide: "leave", theme: "os-theme-light" },
      }}
    >
      {isLoading
        ? [...Array(6)].map((x, i) => (
            <SpotifyObjectCardSkeleton
              key={i}
              imageOnly={true}
            />
          ))
        : playlists?.map((playlist) => {
            return (
              <Fragment key={playlist.id}>
                <Tooltip<HTMLDivElement>
                  position={TooltipPosition.Right}
                  tooltipElement={
                    <div className='flex flex-col font-sans text-sm'>
                      <div className='font-bold'>{playlist.name}</div>
                      <div className='flex gap-1 text-spotify-gray'>
                        <div>{utils.upperFirstLetter(playlist.type)}</div>
                        <div>&#xb7;</div>
                        <div>{playlist.owner.display_name}</div>
                      </div>
                    </div>
                  }
                >
                  {({ ref, setHover }) => (
                    <SpotifyObjectCard
                      type={SpotifyObjectType.Playlist}
                      className={"min-w-14 min-h-14 p-1"}
                      data={playlist}
                      imageOnly={true}
                      ref={ref}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    ></SpotifyObjectCard>
                  )}
                </Tooltip>
              </Fragment>
            );
          })}
    </OverlayScrollbarsComponent>
  );
}

export default SidebarPlaylistLibrary;
