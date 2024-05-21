import { useCallback, useContext, useEffect, useState } from "react";
import { usePlayerContext } from "../../../context/playerContext";
import { TokenContext } from "../../../context/tokenContext";
import { spotifyAPI } from "../../../api/spotifyAxios";
import { PlayerStateContext, Track } from "../../../api/base";
import { millisToMinutesAndSeconds } from "../../../utils/util";
import Button from "../../../component/Button";
import { FiPause, FiPlay } from "react-icons/fi";
import TrackList from "./components/TrackList";
import { CollectionType } from "../../../utils/enums";
import CollectionOwnerImage from "./components/CollectionOwnerImage";

interface Props {
  type: CollectionType;
  collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull | null;
}

interface DeviceData {
  id: string;
  name: string;
}

interface DataContext {
  context: Spotify.PlaybackContext | PlayerStateContext;
  paused: boolean;
  current_track?: Spotify.Track | Track;
  device?: DeviceData;
}

function CollectionsTemplate({ type, collection }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [anotherDevice, setAnotherDevice] = useState<DeviceData | null>(null);
  const [currentTrackUri, setCurrentTrackUri] = useState("");
  const { player, playerId, isActive } = usePlayerContext();
  const token = useContext(TokenContext);
  console.log(collection);

  function isPlaylistTrack(
    item: SpotifyApi.TrackObjectSimplified | SpotifyApi.PlaylistTrackObject
  ): item is SpotifyApi.PlaylistTrackObject {
    return (item as SpotifyApi.PlaylistTrackObject).track !== undefined;
  }

  function isPlaylist(
    collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull
  ): collection is SpotifyApi.PlaylistObjectFull {
    return (collection as SpotifyApi.PlaylistObjectFull).type === "playlist";
  }

  const isTrackOnCollection = collection?.tracks.items.some((i) => {
    return isPlaylistTrack(i)
      ? i.track?.uri === currentTrackUri
      : i.uri === currentTrackUri;
  });

  const isPlayedInAnotherDevice = !isActive && isPlaying;

  function calculateDuration(
    tracks:
      | SpotifyApi.PlaylistTrackObject[]
      | SpotifyApi.TrackObjectSimplified[]
  ) {
    if (!tracks) return;

    const totalDuration = tracks.reduce((acc, obj) => {
      if (isPlaylistTrack(obj)) {
        if (obj.track) {
          return acc + obj.track.duration_ms;
        } else {
          return acc + 0;
        }
      } else {
        if (obj) {
          return acc + obj.duration_ms;
        } else {
          return acc + 0;
        }
      }
    }, 0);
    return totalDuration;
  }

  const getCurrentContext = useCallback(
    (data: DataContext) => {
      const currentContext = data?.context;
      if (!currentContext || currentContext?.uri !== collection?.uri) {
        setIsPlaying(false);
        setCurrentTrackUri("");
        return;
      }

      const currentTrack = data?.current_track;
      console.log(currentTrack);

      setCurrentTrackUri(currentTrack?.uri || "");

      const isPaused = data?.paused;
      setIsPlaying(!isPaused);

      if (data.device) {
        const deviceData = {
          id: data.device.id,
          name: data.device.name,
        };
        setAnotherDevice(deviceData);
      }
    },
    [collection]
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
        await spotifyAPI.pausePlayer(token).then(() => setIsPlaying(false));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function play(playlistUri: string) {
    if (player && isActive && isTrackOnCollection) {
      player.resume();
    } else if (isTrackOnCollection) {
      const { progress_ms, item } = await spotifyAPI.getPlayerState(token);

      const data = {
        context_uri: playlistUri,
        offset: {
          uri: item?.uri,
        },
        position_ms: progress_ms,
      };

      console.log(data);

      await spotifyAPI.playPlayer(token, data).then(() => setIsPlaying(true));
    } else {
      try {
        const data = {
          context_uri: playlistUri,
          offset: {
            position: 0,
          },
          position_ms: 0,
        };
        await spotifyAPI.playPlayer(token, data).then(() => setIsPlaying(true));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function playTrack(trackUri: string) {
    const isCurrentTrack = trackUri === currentTrackUri;
    if (player && isActive && isCurrentTrack) {
      player.resume();
    } else {
      try {
        const data = {
          context_uri: collection?.uri,
          offset: {
            uri: trackUri,
          },
          position_ms: 0,
        };

        await spotifyAPI.playPlayer(token, data).then(() => setIsPlaying(true));
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    async function requestPlayerState() {
      console.log("requesting player state from playlist page...");
      try {
        let data: DataContext;
        if (player && isActive) {
          console.log(player);
          const res = await player.getCurrentState();

          if (!res) return;

          data = {
            context: res.context,
            paused: res.paused,
            current_track: res.track_window.current_track,
          };
        } else {
          const res = await spotifyAPI.getPlayerState(token);

          if (!res) return;
          data = {
            context: res.context,
            paused: !res.is_playing,
            current_track: res.item,
            device: res.device,
          };
          console.log(res);
        }
        getCurrentContext(data);
      } catch (err) {
        console.log(err);
      }
    }

    requestPlayerState();
  }, [player, isActive, token, getCurrentContext]);

  useEffect(() => {
    function onStateChange(state: Spotify.PlaybackState) {
      if (!state || !collection) {
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
  }, [collection, player, getCurrentContext]);

  function formatCollectionDuration(duration: number) {
    if (!duration) return;

    const timeDetails = millisToMinutesAndSeconds(duration);
    let res = `${timeDetails.hours ? timeDetails.hours + " hr" : ""} `;
    res += `${timeDetails.minutes} min `;
    res += `${!timeDetails.hours ? timeDetails.seconds + " sec" : ""} `;

    return res;
  }

  function formatFollowers(total: number) {
    if (!total) return;

    const arr = [];
    while (total) {
      arr.push(total % 1000);
      total = Math.floor(total / 1000);
    }
    return arr.reverse().join(",");
  }

  return (
    collection && (
      <>
        <div className='w-full flex gap-2'>
          <div className='w-[30%] min-w-36 max-w-72'>
            <img
              className='max-w-full max-h-full rounded-md shadow-md'
              src={collection.images[0].url}
            ></img>
          </div>
          <div className='flex flex-col justify-end text-sm gap-2 w-[70%] min-w-[calc(100%-18rem)] max-w-[calc(100%-9rem)]'>
            {isPlaylist(collection) && (
              <div className=''>
                {collection.public ? "Public" : "Private"} Playlist
              </div>
            )}

            <div className='font-bold text-4xl lg:text-6xl'>
              {collection.name}
            </div>
            <div className='text-gray-400 mt-1'>
              {isPlaylist(collection) && collection.description}
            </div>
            <div className='flex text-gray-400 items-center gap-1'>
              {/* need to handle artists! */}
              {
                <CollectionOwnerImage
                  type={type}
                  ownerId={
                    isPlaylist(collection)
                      ? collection.owner.id
                      : collection.artists[0].id
                  }
                />
              }
              <div className='font-bold text-white'>
                {/* handle multiple artists */}
                {isPlaylist(collection)
                  ? collection.owner.display_name
                  : collection.artists[0].name}
              </div>
              <div>&#xb7;</div>
              {isPlaylist(collection) &&
                collection.followers &&
                collection.followers.total !== 0 && (
                  <>
                    <div className=''>
                      {formatFollowers(collection.followers.total)} likes
                    </div>
                    <div>&#xb7;</div>
                  </>
                )}
              <div className=''>
                {collection.tracks.total} songs,{" "}
                {formatCollectionDuration(
                  calculateDuration(collection.tracks.items) || 0
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex mt-4'>
          <Button
            className='p-3'
            onClick={() => {
              if (isPlaying && isTrackOnCollection) {
                if (isPlayedInAnotherDevice) {
                  transferPlayback();
                } else {
                  pause();
                }
              } else {
                play(collection.uri);
              }
              console.log(isPlayedInAnotherDevice);
            }}
          >
            {isPlaying && isTrackOnCollection ? (
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
          type={type}
          tracks={collection.tracks}
          currentTrackUri={currentTrackUri}
          isPlaying={isPlaying}
          onPause={pause}
          onPlay={(trackUri) => playTrack(trackUri)}
        ></TrackList>
      </>
    )
  );
}

export default CollectionsTemplate;
