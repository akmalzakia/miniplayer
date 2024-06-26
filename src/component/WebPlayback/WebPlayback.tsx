import { useState, useEffect, Fragment } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiPlusCircle,
} from "react-icons/fi";
import ProgressBar from "./components/ProgressBar";
import Button from "../Buttons/Button";
import VolumeBar from "./components/VolumeBar";
import { Link } from "react-router-dom";
import usePlayerContext from "../../hooks/Context/usePlayerContext";
import useUserContext from "../../hooks/Context/useUserContext";
import SpotifyImage from "../SpotifyImage";
import { CollectionImageResolution } from "../../utils/enums";
import utils from "../../utils/util";

function WebPlayback() {
  const { player, isActive } = usePlayerContext();
  const { user } = useUserContext();
  const [isPaused, setPaused] = useState(false);
  const [track, setTrack] = useState<Spotify.Track | null>(null);
  const [position, setPosition] = useState(0);

  const defaultVolume = 0.5;
  const [volume, setVolume] = useState(defaultVolume);

  useEffect(() => {
    function onStateChange(state: Spotify.PlaybackState) {
      if (!state) {
        return;
      }
      const currentTrack = state.track_window.current_track;
      setTrack(currentTrack);
      setPaused(state.paused);
      setPosition(state.position);
    }

    if (player.instance) {
      player.instance.addListener("player_state_changed", onStateChange);
    }

    return () => {
      if (player.instance) {
        player.instance.removeListener("player_state_changed", onStateChange);
      }
    };
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive && !isPaused) setPosition((p) => p + 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isPaused, isActive]);

  return (
    <>
      <div className='w-full sticky bottom-0 bg-spotify-black p-2 flex'>
        {user?.product === "premium" ? (
          isActive ? (
            <>
              <div className='flex gap-3 w-1/4'>
                <div className='w-14 h-14'>
                  <SpotifyImage
                    images={track?.album.images}
                    className='rounded-sm'
                    priority='low'
                    resolution={CollectionImageResolution.Low}
                  ></SpotifyImage>
                </div>
                <div className='flex flex-col justify-center'>
                  <Link
                    className='text-sm font-bold hover:underline'
                    to={`/album/${utils.getIdFromUri(track?.album.uri)}`}
                  >
                    {track?.name}
                  </Link>
                  <div className='text-sm font-light text-spotify-gray'>
                    {track?.artists.map((artist, idx) => {
                      const artistId = utils.getIdFromUri(artist.uri);
                      const separator = track.artists.length > idx + 1 && (
                        <>, </>
                      );
                      return (
                        <Fragment key={artistId}>
                          <Link
                            className='hover:underline'
                            to={`/artist/${artistId}`}
                          >
                            {artist.name}
                          </Link>
                          {separator}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className='my-auto'>
                  <FiPlusCircle></FiPlusCircle>
                </div>
              </div>
              <div className='flex flex-col w-1/2 items-center py-1'>
                <div className='flex justify-center mb-2'>
                  <div className='flex gap-1 ml-auto mr-auto'>
                    <Button
                      onClick={() => {
                        player?.instance?.previousTrack();
                      }}
                    >
                      <FiChevronLeft></FiChevronLeft>
                    </Button>
                    <Button
                      onClick={() => {
                        player?.instance?.togglePlay();
                      }}
                    >
                      {isPaused ? <FiPlay></FiPlay> : <FiPause></FiPause>}
                    </Button>
                    <Button
                      onClick={() => {
                        player?.instance?.nextTrack();
                      }}
                    >
                      <FiChevronRight></FiChevronRight>
                    </Button>
                  </div>
                </div>
                {player && (
                  <ProgressBar
                    className={"w-3/4"}
                    player={player.instance}
                    position={position}
                    duration={track?.duration_ms || 0}
                  ></ProgressBar>
                )}
              </div>
              <div className='flex justify-end w-1/4'>
                <VolumeBar
                  value={volume * 100}
                  onVolumeChanged={(e) => {
                    const vol = parseInt(e.target.value);
                    player?.instance?.setVolume(vol / 100).then(() => {
                      setVolume(vol / 100);
                    });
                  }}
                ></VolumeBar>
              </div>
            </>
          ) : (
            <>
              <div className='flex justify-center w-full'>
                <b>
                  Instances not active. Transfer your playback using your
                  Spotify app
                </b>
              </div>
            </>
          )
        ) : (
          <div className='flex justify-center w-full'>
            <b>
              <Link
                to='https://www.spotify.com/premium/'
                className='underline text-spotify-green'
              >
                Upgrade to Premium
              </Link>{" "}
              to access Spotify Playback
            </b>
          </div>
        )}
      </div>
    </>
  );
}

export default WebPlayback;
