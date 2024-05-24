import { useParams } from "react-router-dom";
import useArtist from "../hooks/useArtist";
import { formatFollowers, formatTimeMinSecond } from "../utils/util";
import { Textfit } from "react-textfit";
import { FiPause, FiPlay } from "react-icons/fi";
import Button from "../component/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "../context/tokenContext";
import { SpotifyObjectType } from "../utils/enums";
import SingleDisplay from "../component/SingleDisplay";
import useTopTracks from "../hooks/Artist/useTopTracks";
import useArtistAlbums from "../hooks/Artist/useArtistAlbums";
import useRelatedArtists from "../hooks/Artist/useRelatedArtists";
import { usePlayerContext } from "../context/playerContext";
import { PlayerStateContext, Track } from "../api/base";

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

function Artist() {
  const { id: artistId } = useParams();
  const token = useContext(TokenContext);
  const [artist, isLoading] = useArtist(artistId || "");
  const [topTracks, isTrackLoading] = useTopTracks(token, artistId);
  const [albums, isAlbumsLoading] = useArtistAlbums(token, artistId);
  const [relatedArtists, isRelatedArtistLoading] = useRelatedArtists(
    token,
    artistId
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const { player, playerId, isActive } = usePlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [anotherDevice, setAnotherDevice] = useState<DeviceData | null>(null);
  const [currentTrackUri, setCurrentTrackUri] = useState("");
  const [currentHover, setCurrentHover] = useState("");

  const isTrackOnTopTracks = topTracks?.some((i) => {
    return i.uri === currentTrackUri;
  });

  const isTrackPlayed = (trackId?: string) =>
    isActive && currentTrackUri === trackId;

  const isPlayedInAnotherDevice = !isActive && isPlaying;

  async function play(artistUri: string) {
    if (player && isActive && isTrackOnTopTracks) {
      player.resume();
    } else {
      try {
        const data = {
          context_uri: artistUri,
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
          uris: [trackUri],
          position_ms: 0,
        };

        await spotifyAPI.playPlayer(token, data).then(() => setIsPlaying(true));
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

  const getCurrentContext = useCallback((data: DataContext) => {
    const currentContext = data?.context;
    if (!currentContext) {
      setIsPlaying(false);
      setCurrentTrackUri("");
      return;
    }

    const currentTrack = data?.current_track;
    setCurrentTrackUri(currentTrack?.uri || "");
    console.log(currentTrack);

    const isPaused = data?.paused;
    setIsPlaying(!isPaused);

    if (data.device) {
      const deviceData = {
        id: data.device.id,
        name: data.device.name,
      };
      setAnotherDevice(deviceData);
    }
  }, []);

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
      if (!state || !artist) {
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
  }, [artist, player, getCurrentContext]);

  return (
    <div className='px-2'>
      <div className='py-2 flex w-full gap-4'>
        <div className='w-40 shrink-0'>
          <img
            className='rounded-full shadow-md max-w-full max-h-full'
            height={artist?.images[0].height}
            width={artist?.images[0].width}
            src={artist?.images[0].url}
          ></img>
        </div>
        <div className='flex flex-col justify-between gap-4 w-[calc(100%-10.5rem)] flex-grow-0'>
          <div></div>
          <div className='font-bold'>
            <Textfit
              mode='single'
              min={36}
              max={90}
            >
              {artist?.name}
            </Textfit>
          </div>
          <div className='font-normal'>
            {formatFollowers(artist?.followers.total || 0)} monthly listeners
          </div>
        </div>
      </div>
      <div className='py-2 flex gap-2'>
        <Button
          className='p-3'
          onClick={() => {
            if (isPlaying && isTrackOnTopTracks) {
              if (isPlayedInAnotherDevice) {
                transferPlayback();
              } else {
                pause();
              }
            } else {
              play(artist?.uri || "");
            }
          }}
        >
          {isPlaying && isTrackOnTopTracks ? (
            isPlayedInAnotherDevice ? (
              <>Playing on {anotherDevice?.name}</>
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
                className={`flex justify-between p-2 gap-2 hover:bg-white hover:bg-opacity-5 text-sm text-gray-400 rounded-md ${
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
                      isPlaying ? (
                        <FiPause
                          className='my-1'
                          onClick={pause}
                        />
                      ) : (
                        <FiPlay
                          className='my-1'
                          onClick={() => playTrack(track.uri)}
                        />
                      )
                    ) : currentHover === track?.id ? (
                      <FiPlay
                        className='my-1'
                        onClick={() => playTrack(track.uri)}
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
                  {formatTimeMinSecond(track.duration_ms)}
                </div>
              </div>
            ))}
        </div>
        <button
          className='text-sm font-bold text-gray-600 pointer hover:text-white'
          onClick={() => setIsExpanded((s) => !s)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>
      {albums && (
        <SingleDisplay
          title='Albums'
          data={albums.items}
          type={SpotifyObjectType.Album}
        />
      )}
      {relatedArtists && (
        <SingleDisplay
          title='Related Artists'
          data={relatedArtists}
          type={SpotifyObjectType.Artist}
        />
      )}
    </div>
  );
}

export default Artist;
