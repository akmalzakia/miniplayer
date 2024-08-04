import { useState } from "react";
import utils from "../../../utils/util";
import SpotifyImage from "../../../component/SpotifyImage";
import usePlayerContext from "../../../hooks/Context/usePlayerContext";
import { FiPause, FiPlay } from "react-icons/fi";
import PlayWarningModal from "../../../component/Modals/PlayWarningModal";
import useModalContext from "../../../hooks/Context/useModalContext";
import { CollectionImageResolution } from "../../../utils/enums";

interface ArtistTopTracksProps {
  tracks: SpotifyApi.TrackObjectFull[];
  expandable: { enabled: boolean; preview?: number };
}

function ArtistTopTracks({ tracks, expandable }: ArtistTopTracksProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHover, setCurrentHover] = useState("");

  const { playerDispatcher, currentContext, isActive } = usePlayerContext();
  const isTrackPlayed = (trackId?: string) =>
    isActive && currentContext?.current_track?.uri === trackId;
  const { openModal } = useModalContext();

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

  return (
    <>
      <div className={`py-1 ${expandable.enabled && !isExpanded && "h-72"}`}>
        {tracks
          .slice(
            0,
            expandable.enabled && isExpanded
              ? tracks.length
              : expandable.preview ?? 0
          )
          .map((track, idx) => (
            <div
              key={track.id}
              className={`flex justify-between p-2 gap-2 hover:bg-spotify-hover text-sm text-spotify-gray rounded-md h-14 ${
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
      {expandable.enabled && (
        <button
          className='text-sm font-bold text-spotify-gray pointer hover:text-white'
          onClick={() => setIsExpanded((s) => !s)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </>
  );
}

export default ArtistTopTracks;
