import { useState, useEffect } from 'react';
import { millisToMinutesAndSeconds } from './utils/util';
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiVolume2,
} from 'react-icons/fi';

const track = {
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '' }],
  duration_ms: 0,
};

function WebPlayback() {
  const [currentPlayer, setPlayer] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [position, setPosition] = useState(0)

  const defaultVolume = 0.5
  const [volume, setVolume] = useState(defaultVolume)

  useEffect(() => {
    if (isLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    function onSDKReady() {
      console.log('currentPlayer', currentPlayer);
      if (currentPlayer) return;
      console.log('trying to create new player');
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb) => {
          cb(localStorage.getItem('access_token'));
        },
        volume: defaultVolume,
      });

      setPlayer(player);
      setVolume(defaultVolume)

      function onDeviceOnline(device_id) {
        console.log('Ready with device ID', device_id);
      }

      function onDeviceOffline(device_id) {
        console.log('Device ID has gone offline', device_id);
      }

      function onStateChange(state) {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setPosition(state.position)
        console.log(state)

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      }

      player.addListener('ready', onDeviceOnline);
      player.addListener('not_ready', onDeviceOffline);
      player.addListener('player_state_changed', onStateChange);

      player.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
      });

      player.on('authentication_error', ({ message }) => {
        console.error('Failed to authenticate', message);
      });

      player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
      });

      player.on('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account', message);
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
      if (!is_paused) setPosition(p => p + 1000)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [is_paused])

  function progressBarValue() {
    const progress = position / current_track.duration_ms
    console.log(position, current_track.duration_ms)
    return progress * 100
  }

  function progressToPositionMs(progress) {
    const position = progress / 100 * current_track.duration_ms
    return position
  }

  if (!is_active) {
    return (
      <>
        <div className='container'>
          <div className='main-wrapper'>
            <b>
              Instances not active. Transfer your playback using your
              Spotify app
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='w-full'>
          <div className='main-wrapper my-10 bg-gray-900 p-10 rounded-md'>
            <img
              src={current_track.album.images[0].url}
              className='now-playing__cover'></img>
            <div className='now-playing__side flex flex-col flex-1 py-5 justify-between'>
              <div>
                <div className='now-playing__name font-bold text-4xl'>
                  {current_track.name}
                </div>
                <div className='now-playing__artist text-lg'>
                  {current_track.artists[0].name}
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex justify-between gap-3 my-2'>
                  <div className='text-xs'>{millisToMinutesAndSeconds(
                    position
                  )}</div>
                  <input
                    type='range'
                    className='flex-1 bg-gray-700 rounded-lg'
                    value={progressBarValue()}
                    onChange={(e) => {
                      console.log("fired", e.target.value)
                      const pos = progressToPositionMs(e.target.value)
                      console.log("seek to", pos)
                      currentPlayer.seek(pos)
                    }}
                  >
                  </input>
                  <div className='text-xs'>
                    {millisToMinutesAndSeconds(
                      current_track.duration_ms
                    )}
                  </div>
                </div>
                <div className='flex items-center relative'>
                  <div className='flex absolute gap-1 w-1/4 h-4 items-center text-xl'>
                    <FiVolume2></FiVolume2>
                    <input
                      type='range'
                      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                      onInput={(e) => {
                        const vol = e.target.value
                        currentPlayer.setVolume(vol / 100).then(() => {
                          setVolume(vol / 100)
                        })
                      }}
                      value={volume * 100}
                    />
                  </div>
                  <div className='flex gap-1 ml-auto mr-auto'>
                    <button
                      className='btn-spotify bg-spotify-green'
                      onClick={() => {
                        currentPlayer.previousTrack();
                      }}>
                      <FiChevronLeft></FiChevronLeft>
                    </button>
                    <button
                      className='btn-spotify bg-spotify-green'
                      onClick={() => {
                        currentPlayer.togglePlay();
                      }}>
                      {is_paused ? (
                        <FiPlay></FiPlay>
                      ) : (
                        <FiPause></FiPause>
                      )}
                    </button>
                    <button
                      className='btn-spotify bg-spotify-green'
                      onClick={() => {
                        currentPlayer.nextTrack();
                      }}>
                      <FiChevronRight></FiChevronRight>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
