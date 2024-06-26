import { useParams } from "react-router-dom";
import useArtist from "../hooks/Artist/useArtist";
import utils from "../utils/util";
import { Textfit } from "react-textfit";
import { FiPause, FiPlay } from "react-icons/fi";
import { useRef, useState } from "react";
import { CollectionImageResolution, SpotifyObjectType } from "../utils/enums";
import SingleDisplay from "../component/SingleDisplay";
import useTopTracks from "../hooks/Artist/useTopTracks";
import useArtistAlbums from "../hooks/Artist/useArtistAlbums";
import useRelatedArtists from "../hooks/Artist/useRelatedArtists";
import usePlayerContext from "../hooks/Context/usePlayerContext";
import usePlayerStateFetcher from "../hooks/usePlayerStateFetcher";
import LoadingDots from "../component/LoadingDots";
import SpotifyImage from "../component/SpotifyImage";
import MajorPlayButton from "../component/Buttons/MajorPlayButton";
import useModalContext from "../hooks/Context/useModalContext";
import PlayWarningModal from "../component/Modals/PlayWarningModal";
import useDynamicTopbar from "../hooks/useDynamicTopbar";
import { createPortal } from "react-dom";

function Artist() {
  const { id: artistId } = useParams();
  const [artist, isLoading] = useArtist(artistId || "");
  const [topTracks, isTrackLoading] = useTopTracks(artistId);
  const [albums, isAlbumsLoading] = useArtistAlbums(artistId || "", 10);
  const [relatedArtists, isRelatedArtistLoading] = useRelatedArtists(artistId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHover, setCurrentHover] = useState("");

  const { openModal } = useModalContext();
  const { playerDispatcher, currentContext, isActive } = usePlayerContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const portal = document.getElementById("topbar-content-wrapper");
  const topbarContentTriggerRef = useDynamicTopbar<HTMLElement>(contentRef);

  const isTrackPlayed = (trackId?: string) =>
    isActive && currentContext?.current_track?.uri === trackId;

  usePlayerStateFetcher(artist);

  const isDataLoading =
    isLoading && isTrackLoading && isAlbumsLoading && isRelatedArtistLoading;

  function play(track: SpotifyApi.TrackObjectFull) {
    if (!currentContext) {
      openModal(
        <PlayWarningModal
          transferPlayback={playerDispatcher.transferPlayback}
        />
      );
      return;
    }

    playerDispatcher.playTrackOnly(track.uri);
  }

  if (isDataLoading) {
    return (
      <div className='w-full h-full flex'>
        <LoadingDots className='h-[15px] w-full m-auto' />
      </div>
    );
  }

  return (
    <>
      {portal &&
        artist &&
        createPortal(
          <div
            ref={contentRef}
            className={`flex invisible gap-4`}
          >
            <div>
              <MajorPlayButton playableObjects={artist}></MajorPlayButton>
            </div>
            <b className='text-xl my-auto'>{artist.name}</b>
          </div>,
          portal
        )}
      <div className='px-2'>
        <div ref={topbarContentTriggerRef}>
          <div className='py-2 flex w-full gap-4'>
            <div className='w-40 shrink-0'>
              <SpotifyImage
                className='rounded-full shadow-md max-w-full max-h-full'
                images={artist?.images}
                resolution={CollectionImageResolution.Medium}
              ></SpotifyImage>
            </div>
            <div className='flex flex-col justify-between gap-4 w-[calc(100%-10.5rem)] flex-grow-0 h-[175px]'>
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
            {artist && <MajorPlayButton playableObjects={artist} />}
          </div>
        </div>
        <div className='py-4'>
          <div className='font-bold text-xl'>Popular</div>
          <div className={`py-1 ${!isExpanded && "h-72"}`}>
            {topTracks
              ?.slice(0, isExpanded ? topTracks.length : topTracks.length / 2)
              .map((track, idx) => (
                <div
                  key={track.id}
                  className={`flex justify-between p-2 gap-2 hover:bg-spotify-hover text-sm text-spotify-gray rounded-md h-14 ${
                    isTrackPlayed(track.uri)
                      ? "border border-spotify-green"
                      : ""
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
                            onClick={() => play(track)}
                          />
                        )
                      ) : currentHover === track?.id ? (
                        <FiPlay
                          className='my-1'
                          onClick={() => play(track)}
                        />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className='w-10 min-w-10'>
                      <SpotifyImage
                        className='max-w-full max-h-full rounded-md'
                        images={track.album.images}
                        resolution={CollectionImageResolution.Low}
                        lazy
                      ></SpotifyImage>
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
        <SingleDisplay
          title='Albums'
          data={albums}
          type={SpotifyObjectType.Album}
          isLoading={isAlbumsLoading}
          detailLink='discography/all'
          lazy
        />
        <SingleDisplay
          title='Related Artists'
          data={relatedArtists}
          type={SpotifyObjectType.Artist}
          isLoading={isRelatedArtistLoading}
          lazy
        />
      </div>
    </>
  );
}

export default Artist;
