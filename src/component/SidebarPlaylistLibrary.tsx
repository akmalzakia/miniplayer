import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Fragment } from "react";
import SpotifyObjectCardSkeleton from "./SpotifyObjectCardSkeleton";
import SpotifyObjectCard from "./SpotifyObjectCard";
import { CollectionImageResolution, SpotifyObjectType, TooltipPosition } from "../utils/enums";
import utils from "../utils/util";
import Tooltip from "./Tooltip";
import useUserPlaylists from "../hooks/useUserPlaylists";

function SidebarPlaylistLibrary() {
  const [playlists, isLoading] = useUserPlaylists();

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
                      imagePriority="low"
                      imageResolution={CollectionImageResolution.Low}
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
