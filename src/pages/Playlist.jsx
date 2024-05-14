import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../context/tokenContext";
import { formatTimeMinSecond, millisToMinutesAndSeconds } from "../utils/util";
import Button from "../component/Button";
import { FiPause, FiPlay } from "react-icons/fi";
import { PlayerContext } from "../context/playerContext";
import { spotifyAPI } from "../api/spotifyAxios";
import usePlaylist from "../hooks/usePlaylist";

function Playlist() {
  const playlistId = useParams();

  const playlist = usePlaylist(playlistId.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anotherDevice, setAnotherDevice] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState("");
  const { player, isActive } = useContext(PlayerContext);
  const token = useContext(TokenContext);

  const isTrackOnPlaylist = playlist.tracks.items.some(
    (i) => i.track.id === currentTrackId
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
        setCurrentTrackId(null);
        return;
      }

      const currentTrack = data?.current_track;
      setCurrentTrackId(currentTrack?.id);

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

  async function pause() {
    if (player && isActive) {
      player.pause();
    } else {
      try {
        await spotifyAPI.pausePlayer(token);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function play(playlistUri) {
    if (player && isActive && isTrackOnPlaylist) {
      player.resume();
    } else {
      try {
        const data = {
          context_uri: playlistUri,
          offset: {
            position: 0,
          },
          position_ms: 0,
        };
        await spotifyAPI.playPlayer(token, data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  // need to check if still fetching playlist to prevent this effect to trigger twice
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
          console.log(res);
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

  function formatDateAdded(datetime) {
    if (!datetime) return;

    const date = new Date(datetime.split("T")[0]);
    const dateDifference = Math.floor(
      (Date.now() - date) / (1000 * 60 * 60 * 24)
    );

    const monthDifference = Math.floor(dateDifference / 30);
    const yearDifference = Math.floor(monthDifference / 12);

    if (yearDifference) {
      return `${yearDifference > 1 ? yearDifference + "years" : "a year"} ago`;
    } else if (monthDifference) {
      return `${
        monthDifference > 1 ? monthDifference + " months" : "a month"
      } ago`;
    } else {
      return `${dateDifference > 1 ? dateDifference + " days" : "a day"} ago`;
    }
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
          <div className='w-[30%] max-w-fit min-w-36'>
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
          <Button className='p-3'>
            {isPlaying && isTrackOnPlaylist ? (
              isPlayedInAnotherDevice ? (
                <>
                  Playing on {anotherDevice?.name}
                </>
              ) : (
                <FiPause
                  className='text-xl'
                  onClick={pause}
                ></FiPause>
              )
            ) : (
              <FiPlay
                className='text-xl'
                onClick={() => {
                  play(playlist.uri);
                }}
              ></FiPlay>
            )}
          </Button>
        </div>
        <table className='table-fixed w-full text-sm text-gray-400'>
          <thead className='border-b'>
            <tr className='text-left'>
              <th className='text-right pr-3 font-normal w-8'>#</th>
              <th className='font-normal w-1/3'>Title</th>
              <th className='font-normal w-1/3'>Album</th>
              <th className='py-1 pr-2 font-normal'>Date Added</th>
              <th className='font-normal'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.items.map((item, idx) => (
              <tr
                key={item.track.id}
                className={`hover:bg-slate-800 ${
                  currentTrackId === item.track.id && isActive
                    ? "border border-spotify-green"
                    : ""
                }`}
              >
                <td className='text-right pr-3'>{idx + 1}</td>
                <td className='flex items-center py-2 gap-2'>
                  <div className='w-10 min-w-10'>
                    <img
                      className='max-w-full max-h-full rounded-md'
                      src={item.track.album.images[0].url}
                    />
                  </div>
                  <div>
                    <div className='text-white'>{item.track.name}</div>
                    <div className=''>
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  </div>
                </td>
                <td className='text-ellipsis overflow-hidden text-nowrap'>
                  {item.track.album.name}
                </td>
                <td className='pr-2'>{formatDateAdded(item.added_at)}</td>
                <td>{formatTimeMinSecond(item.track.duration_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  );
}

export default Playlist;
