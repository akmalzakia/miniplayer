import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/tokenContext";
import { millisToMinutesAndSeconds } from "../../utils/util";
import Button from "../../component/Button";
import { FiPause, FiPlay } from "react-icons/fi";
import { PlayerContext } from "../../context/playerContext";
import { spotifyAPI } from "../../api/spotifyAxios";
import usePlaylist from "../../hooks/usePlaylist";
import TrackList from "./components/TrackList";

function Playlist() {
  const playlistId = useParams();

  const [playlist] = usePlaylist(playlistId.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anotherDevice, setAnotherDevice] = useState(null);
  const [currentTrackUri, setCurrentTrackUri] = useState("");
  const { player, playerId, isActive } = useContext(PlayerContext);
  const token = useContext(TokenContext);

  const isTrackOnPlaylist = playlist.tracks.items.some(
    (i) => i.track.uri === currentTrackUri
  );

  const isPlayedInAnotherDevice = !isActive && isPlaying;

  function calculateDuration(tracks) {
    if (!tracks) return;

    const totalDuration = tracks.reduce(
      (acc, obj) => acc + obj.track.duration_ms,
      0
    );
    return totalDuration;
  }

  const getCurrentContext = useCallback(
    (data) => {
      const currentContext = data?.context;
      if (!currentContext || currentContext?.uri !== playlist?.uri) {
        setIsPlaying(false);
        setCurrentTrackUri("");
        return;
      }

      const currentTrack = data?.current_track;
      setCurrentTrackUri(currentTrack?.uri);

      const isPaused = data?.paused;
      setIsPlaying(!isPaused);

      const deviceData = {
        id: data?.device?.id,
        name: data?.device?.name,
      };

      setAnotherDevice(deviceData);
    },
    [playlist]
  );

  async function transferPlayback() {
    if (playerId) {
      try {
        const data = {
          device_ids: [playerId],
        };
        await spotifyAPI.transferPlayback(token, data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function pause() {
    if (player && isActive) {
      player.pause();
    } else {
      try {
        await spotifyAPI.pausePlayer(token).then(setIsPlaying(false));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function play(playlistUri) {
    if (player && isActive && isTrackOnPlaylist) {
      player.resume();
    } else if (isTrackOnPlaylist) {
      const { progress_ms, item } = await spotifyAPI.getPlayerState(token);

      const data = {
        context_uri: playlistUri,
        offset: {
          uri: item.uri,
        },
        position_ms: progress_ms,
      };

      await spotifyAPI.playPlayer(token, data).then(setIsPlaying(true));
    } else {
      try {
        const data = {
          context_uri: playlistUri,
          offset: {
            position: 0,
          },
          position_ms: 0,
        };
        await spotifyAPI.playPlayer(token, data).then(setIsPlaying(true));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function playTrack(trackUri) {
    const isCurrentTrack = trackUri === currentTrackUri;
    if (player && isActive && isCurrentTrack) {
      player.resume();
    } else {
      try {
        const data = {
          context_uri: playlist.uri,
          offset: {
            uri: trackUri,
          },
          position_ms: 0,
        };

        await spotifyAPI.playPlayer(token, data).then(setIsPlaying(true));
      } catch (err) {
        console.log(err);
      }
    }
  }

  
  useEffect(() => {
    async function requestPlayerState() {
      console.log("requesting player state from playlist page...");
      try {
        let data;
        if (player && isActive) {
          console.log(player);
          const res = await player.getCurrentState();
          data = {
            context: res.context,
            paused: res.paused,
            current_track: res.track_window.current_track,
          };
        } else {
          const res = await spotifyAPI.getPlayerState(token);
          data = {
            context: res.context,
            paused: !res.is_playing,
            current_track: res.item,
            device: res.device,
          };
        }
        getCurrentContext(data);
      } catch (err) {
        console.log(err);
      }
    }

    requestPlayerState();
  }, [player, isActive, token, getCurrentContext]);

  useEffect(() => {
    function onStateChange(state) {
      if (!state || !playlist) {
        return;
      }
      const data = {
        context: state.context,
        paused: state.paused,
        current_track: state.track_window.current_track,
      };
      getCurrentContext(data);
    }

    if (player) {
      player.addListener("player_state_changed", onStateChange);
    }
    return () => {
      if (player) {
        player.removeListener("player_state_changed", onStateChange);
      }
    };
  }, [playlist, player, getCurrentContext]);

  function formatPlaylistDuration(duration) {
    if (!duration) return;

    const timeDetails = millisToMinutesAndSeconds(duration);
    let res = `${timeDetails.hours ? timeDetails.hours + " hr" : ""} `;
    res += `${timeDetails.minutes} min`;
    res += `${!timeDetails.hours ? timeDetails.seconds + " sec" : ""} `;

    return res;
  }

  function formatFollowers(total) {
    if (!total) return;

    let arr = [];
    while (total) {
      arr.push(total % 1000);
      total = Math.floor(total / 1000);
    }
    return arr.reverse().join(",");
  }

  return (
    playlist && (
      <>
        <div className='w-full flex gap-2'>
          <div className='w-[30%] min-w-36 max-w-72'>
            <img
              className='max-w-full max-h-full rounded-md shadow-md'
              src={playlist.images[0].url}
            ></img>
          </div>
          <div className='flex flex-col justify-end text-sm gap-2'>
            <div className=''>
              {playlist.public ? "Public" : "Private"} Playlist
            </div>
            <div className='font-bold text-6xl lg:text-7xl text-nowrap'>
              {playlist.name}
            </div>
            <div className='text-gray-400 mt-1'>{playlist.description}</div>
            <div className='flex text-gray-400'>
              <div className='font-bold text-white'>
                {playlist.owner.display_name}
              </div>
              <div className='mx-1'>&#xb7;</div>
              {playlist.followers && playlist.followers.total !== 0 && (
                <>
                  <div className=''>
                    {formatFollowers(playlist.followers.total)} likes
                  </div>
                  <div className='mx-1'>&#xb7;</div>
                </>
              )}
              <div className=''>
                {playlist.tracks.total} songs,{" "}
                {formatPlaylistDuration(
                  calculateDuration(playlist.tracks.items)
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex mt-4'>
          <Button
            className='p-3'
            onClick={() => {
              if (isPlaying && isTrackOnPlaylist) {
                if (isPlayedInAnotherDevice) {
                  transferPlayback();
                } else {
                  pause();
                }
              } else {
                play(playlist.uri);
              }
              console.log(isPlayedInAnotherDevice);
            }}
          >
            {isPlaying && isTrackOnPlaylist ? (
              isPlayedInAnotherDevice ? (
                <>Playing on {anotherDevice?.name}</>
              ) : (
                <FiPause className='text-xl'></FiPause>
              )
            ) : (
              <FiPlay className='text-xl'></FiPlay>
            )}
          </Button>
        </div>
        <TrackList
          playlistUri={playlist.uri}
          tracks={playlist.tracks}
          currentTrackUri={currentTrackUri}
          isPlaying={isPlaying}
          onPause={pause}
          onPlay={(trackUri) => playTrack(trackUri)}
        ></TrackList>
      </>
    )
  );
}

export default Playlist;
