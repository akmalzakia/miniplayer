import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiPlusCircle,
} from "react-icons/fi";
import ProgressBar from "./component/ProgressBar";
import Button from "./component/Button";
import VolumeBar from "./component/VolumeBar";

const initialTrack = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
  duration_ms: 0,
};

function WebPlayback() {
  const [currentPlayer, setPlayer] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [track, setTrack] = useState(initialTrack);
  const [position, setPosition] = useState(0);

  const defaultVolume = 0.5;
  const [volume, setVolume] = useState(defaultVolume);

  useEffect(() => {
    if (isLoaded) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    function onSDKReady() {
      console.log("currentPlayer", currentPlayer);
      if (currentPlayer) return;
      console.log("trying to create new player");
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(localStorage.getItem("access_token"));
        },
        volume: defaultVolume,
      });

      setPlayer(player);
      setVolume(defaultVolume);

      function onDeviceOnline(device_id) {
        console.log("Ready with device ID", device_id);
      }

      function onDeviceOffline(device_id) {
        console.log("Device ID has gone offline", device_id);
      }

      function onStateChange(state) {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setPosition(state.position);
        console.log(state);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      }

      player.addListener("ready", onDeviceOnline);
      player.addListener("not_ready", onDeviceOffline);
      player.addListener("player_state_changed", onStateChange);

      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      player.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      player.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });

      player.connect();
    }

    window.onSpotifyWebPlaybackSDKReady = onSDKReady;
    return () => {
      window.onSpotifyWebPlaybackSDKReady = null;
    };
  }, [currentPlayer]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (!isPaused) setPosition((p) => p + 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  return (
    <>
      <div className='w-full sticky bottom-0 bg-gray-900 p-2 flex'>
        {isActive ? (
          <>
            <div className='flex gap-3 w-1/4'>
              <img
                src={track.album.images[0].url}
                className='w-14 h-14 rounded-sm'
              ></img>
              <div className='flex flex-col justify-center'>
                <span className='text-sm font-bold'>{track.name}</span>
                <span className='text-sm font-light text-gray-400'>
                  {track.artists[0].name}
                </span>
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
                      currentPlayer.previousTrack();
                    }}
                  >
                    <FiChevronLeft></FiChevronLeft>
                  </Button>
                  <Button
                    onClick={() => {
                      currentPlayer.togglePlay();
                    }}
                  >
                    {isPaused ? <FiPlay></FiPlay> : <FiPause></FiPause>}
                  </Button>
                  <Button
                    onClick={() => {
                      currentPlayer.nextTrack();
                    }}
                  >
                    <FiChevronRight></FiChevronRight>
                  </Button>
                </div>
              </div>
              <ProgressBar
                className={"w-3/4"}
                player={currentPlayer}
                position={position}
                duration={track.duration_ms}
              ></ProgressBar>
            </div>
            <div className='flex justify-end w-1/4'>
              <VolumeBar
                value={volume * 100}
                onVolumeChanged={(e) => {
                  const vol = e.target.value;
                  currentPlayer.setVolume(vol / 100).then(() => {
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
                Instances not active. Transfer your playback using your Spotify
                app
              </b>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default WebPlayback;
