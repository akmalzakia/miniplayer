import { useParams } from "react-router-dom";
import useArtist from "../hooks/useArtist";
import utils from "../utils/util";
import { Textfit } from "react-textfit";
import { FiPause, FiPlay } from "react-icons/fi";
import Button from "../component/Button";
import { useState } from "react";
import { SpotifyObjectType } from "../utils/enums";
import SingleDisplay from "../component/SingleDisplay";
import useTopTracks from "../hooks/Artist/useTopTracks";
import useArtistAlbums from "../hooks/Artist/useArtistAlbums";
import useRelatedArtists from "../hooks/Artist/useRelatedArtists";
import usePlayerContext from "../hooks/usePlayerContext";
import usePlayerStateFetcher from "../hooks/usePlayerStateFetcher";
import Image from "../component/Image";
import LoadingDots from "../component/LoadingDots";

function Artist() {
  const { id: artistId } = useParams();
  const [artist, isLoading] = useArtist(artistId || "");
  const [topTracks, isTrackLoading] = useTopTracks(artistId);
  const [albums, isAlbumsLoading] = useArtistAlbums(artistId || "", 10);
  const [relatedArtists, isRelatedArtistLoading] = useRelatedArtists(artistId);
  const [isExpanded, setIsExpanded] = useState(false);

  const { playerDispatcher, currentContext, isActive } = usePlayerContext();
  const [currentHover, setCurrentHover] = useState("");

  const isTrackOnTopTracks =
    topTracks &&
    topTracks?.some((i) => {
      return i.uri === currentContext?.current_track?.uri;
    });

  const isTrackPlayed = (trackId?: string) =>
    isActive && currentContext?.current_track?.uri === trackId;

  const isPlayedInAnotherDevice = !isActive && !currentContext?.paused;

  usePlayerStateFetcher(artist);

  const isDataLoading =
    isLoading && isTrackLoading && isAlbumsLoading && isRelatedArtistLoading;

  if (isDataLoading) {
    return (
      <div className='w-full h-full flex'>
        <LoadingDots className='h-[15px] w-full m-auto' />
      </div>
    );
  }

  return (
    <div className='px-2'>
      <div className='py-2 flex w-full gap-4'>
        <div className='w-40 shrink-0'>
          <Image
            className='rounded-full shadow-md max-w-full max-h-full'
            height={artist?.images[0].height}
            width={artist?.images[0].width}
            src={artist?.images[0].url}
          ></Image>
        </div>
        <div className='flex flex-col justify-between gap-4 w-[calc(100%-10.5rem)] flex-grow-0'>
          <div className='font-bold flex-1'>
            <Textfit
              mode='single'
              min={36}
              max={90}
            >
              {artist?.name}
            </Textfit>
          </div>
          <div className='font-normal h-6'>
            <>
              {utils.formatFollowers(artist?.followers.total || 0)} monthly
              listeners
            </>
          </div>
        </div>
      </div>
      <div className='py-2 flex gap-2'>
        <Button
          className='p-3'
          onClick={() => {
            if (!currentContext?.paused && isTrackOnTopTracks) {
              if (isPlayedInAnotherDevice) {
                playerDispatcher.transferPlayback();
              } else {
                playerDispatcher.pause();
              }
            } else {
              playerDispatcher.playArtist(
                artist?.uri || "",
                isTrackOnTopTracks ?? false
              );
            }
          }}
        >
          {!currentContext?.paused && isTrackOnTopTracks ? (
            isPlayedInAnotherDevice ? (
              <>Playing on {currentContext?.device?.name}</>
            ) : (
              <FiPause className='text-xl' />
            )
          ) : (
            <FiPlay className='text-xl' />
          )}
        </Button>
      </div>
      <div className='py-4'>
        <div className='font-bold text-xl'>Popular</div>
        <div className='py-2'>
          {topTracks
            ?.slice(0, isExpanded ? topTracks.length : topTracks.length / 2)
            .map((track, idx) => (
              <div
                key={track.id}
                className={`flex justify-between p-2 gap-2 hover:bg-spotify-hover text-sm text-spotify-gray rounded-md ${
                  isTrackPlayed(track.uri) ? "border border-spotify-green" : ""
                }`}
                onMouseEnter={() => {
                  setCurrentHover(track.id || "");
                }}
                onMouseLeave={() => {
                  setCurrentHover("");
                }}
              >
                <div className='flex gap-2'>
                  <div
                    className={`p-2 w-8 ${
                      isTrackPlayed(track.uri) ? "text-spotify-green" : ""
                    }`}
                  >
                    {isTrackPlayed(track?.uri) ? (
                      !currentContext?.paused ? (
                        <FiPause
                          className='my-1'
                          onClick={playerDispatcher.pause}
                        />
                      ) : (
                        <FiPlay
                          className='my-1'
                          onClick={() =>
                            playerDispatcher.playTrackOnly(track.uri)
                          }
                        />
                      )
                    ) : currentHover === track?.id ? (
                      <FiPlay
                        className='my-1'
                        onClick={() =>
                          playerDispatcher.playTrackOnly(track.uri)
                        }
                      />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className='w-10 min-w-10'>
                    <img
                      className='max-w-full max-h-full rounded-md'
                      src={track.album.images[0].url}
                    ></img>
                  </div>

                  <div className='flex flex-col justify-center'>
                    <div
                      className={`${
                        isTrackPlayed(track.uri)
                          ? "text-spotify-green"
                          : "text-white"
                      }`}
                    >
                      {track.name}
                    </div>
                    {track.explicit && <div>Explicit</div>}
                  </div>
                </div>
                <div className='self-center'>
                  {utils.formatTimeMinSecond(track.duration_ms)}
                </div>
              </div>
            ))}
        </div>
        <button
          className='text-sm font-bold text-spotify-gray pointer hover:text-white'
          onClick={() => setIsExpanded((s) => !s)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>
      {albums && (
        <SingleDisplay
          title='Albums'
          data={albums}
          type={SpotifyObjectType.Album}
          isLoading={isAlbumsLoading}
          detailLink='discography/all'
        />
      )}
      {relatedArtists && (
        <SingleDisplay
          title='Related Artists'
          data={relatedArtists}
          type={SpotifyObjectType.Artist}
          isLoading={isRelatedArtistLoading}
        />
      )}
    </div>
  );
}

export default Artist;
