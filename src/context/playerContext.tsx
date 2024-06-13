import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { spotifyAPI } from "../api/spotifyAxios";
import { TokenContext } from "./tokenContext";
import { DataContext } from "../utils/interfaces";
import useUserContext from "../hooks/useUserContext";

interface PlayerContextType {
  player: {
    id: string;
    instance: Spotify.Player | null;
  };
  playerDispatcher: {
    pause(): void;
    transferPlayback(): void;
    playCollection(
      collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull | SpotifyApi.AlbumObjectSimplified,
      isTrackOnCollection: boolean
    ): void;
    playCollectionTrack(collectionUri: string, trackUri: string): void;
    playArtist(artistUri: string, isTrackOnTopTracks: boolean): void;
    playTrackOnly(trackUri: string): void;
  };
  currentContext: DataContext | null;
  setSpotifyContext(context: DataContext | null): void;
  isActive: boolean;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: PropsWithChildren) {
  const [playerInstance, setPlayerInstance] = useState<Spotify.Player | null>(
    null
  );
  const [playerId, setPlayerId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [currentContext, setCurrentContext] = useState<DataContext | null>(
    null
  );

  const { user } = useUserContext();
  const token = useContext(TokenContext);

  const defaultVolume = 0.5;

  useEffect(() => {
    function onSDKReady() {
      if (playerInstance) return;
      console.log("trying to create new player");
      const newPlayer = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(localStorage.getItem("access_token") || "");
        },
        volume: defaultVolume,
      });

      function onDeviceOnline({ device_id }: Spotify.WebPlaybackInstance) {
        console.log("Ready with device ID", device_id);
        setPlayerInstance(newPlayer);
        setPlayerId(device_id);
      }

      function onDeviceOffline({ device_id }: Spotify.WebPlaybackInstance) {
        console.log("Device ID has gone offline", device_id);
        setPlayerInstance(null);
        setIsActive(false);
        setPlayerId("");
      }

      function onStateChange(state: Spotify.PlaybackState) {
        if (!state) {
          return;
        }

        const data = {
          context: state.context,
          paused: state.paused,
          current_track: state.track_window.current_track,
        };
        setCurrentContext(data);

        if (!state.playback_id && state.playback_quality === "UNKNOWN") {
          newPlayer.disconnect();
          setIsActive(false);
          setPlayerInstance(null);
          console.log("disconnecting");
        } else {
          setIsActive(true);
        }
      }

      newPlayer.addListener("ready", onDeviceOnline);
      newPlayer.addListener("not_ready", onDeviceOffline);
      newPlayer.addListener("player_state_changed", onStateChange);

      newPlayer.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      newPlayer.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      newPlayer.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      newPlayer.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });

      newPlayer.connect();
    }

    if (user?.product === "premium") {
      window.onSpotifyWebPlaybackSDKReady = onSDKReady;
    }
    // removed cleanup function, need to check if triggered twice
  }, [playerInstance, user]);

  const player = useMemo(() => {
    return {
      id: playerId,
      instance: playerInstance,
    };
  }, [playerId, playerInstance]);

  const pause = useCallback(async () => {
    if (player.instance && isActive) {
      player.instance.pause();
    } else {
      try {
        await spotifyAPI.pausePlayer(token).then(() => {
          if (currentContext) {
            setCurrentContext({ ...currentContext, paused: true });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [token, isActive, player, currentContext]);

  const transferPlayback = useCallback(async () => {
    if (player.id) {
      try {
        const data = {
          device_ids: [player.id],
        };
        await spotifyAPI.transferPlayback(token, data);
      } catch (err) {
        console.log(err);
      }
    }
  }, [player, token]);

  const playCollection = useCallback(
    async (
      collection: SpotifyApi.AlbumObjectFull | SpotifyApi.PlaylistObjectFull | SpotifyApi.AlbumObjectSimplified,
      isTrackOnCollection: boolean
    ) => {
      if (player.instance && isActive && isTrackOnCollection) {
        player.instance.resume();
      } else if (isTrackOnCollection) {
        const { progress_ms, item } = await spotifyAPI.getPlayerState(token);

        const data = {
          context_uri: collection.uri,
          offset: {
            uri: item?.uri,
          },
          position_ms: progress_ms,
        };

        await spotifyAPI.playPlayer(token, data).then(() => {
          if (currentContext) {
            setCurrentContext({ ...currentContext, paused: false });
          }
        });
      } else {
        try {
          const data = {
            context_uri: collection.uri,
            offset: {
              position: 0,
            },
            position_ms: 0,
          };
          await spotifyAPI.playPlayer(token, data).then(() => {
            if (currentContext) {
              setCurrentContext({ ...currentContext, paused: false });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    [currentContext, isActive, player, token]
  );

  const playCollectionTrack = useCallback(
    async (collectionUri: string, trackUri: string) => {
      const isCurrentTrack = trackUri === currentContext?.current_track?.uri;
      if (player.instance && isActive && isCurrentTrack) {
        player.instance.resume();
      } else {
        try {
          const data = {
            context_uri: collectionUri,
            offset: {
              uri: trackUri,
            },
            position_ms: 0,
          };

          await spotifyAPI.playPlayer(token, data).then(() => {
            if (currentContext) {
              setCurrentContext({ ...currentContext, paused: false });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    [currentContext, isActive, player, token]
  );

  const playArtist = useCallback(
    async (artistUri: string, isTrackOnTopTracks: boolean) => {
      if (player.instance && isActive && isTrackOnTopTracks) {
        player.instance.resume();
      } else {
        try {
          const data = {
            context_uri: artistUri,
            position_ms: 0,
          };
          await spotifyAPI.playPlayer(token, data).then(() => {
            if (currentContext) {
              setCurrentContext({ ...currentContext, paused: false });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    [currentContext, isActive, player, token]
  );

  const playTrackOnly = useCallback(
    async (trackUri: string) => {
      const isCurrentTrack = trackUri === currentContext?.current_track?.uri;

      if (player.instance && isActive && isCurrentTrack) {
        player.instance.resume();
      } else {
        try {
          const data = {
            uris: [trackUri],
            position_ms: 0,
          };

          await spotifyAPI.playPlayer(token, data).then(() => {
            if (currentContext) {
              setCurrentContext({ ...currentContext, paused: false });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    [currentContext, isActive, player, token]
  );

  const setSpotifyContext = useCallback((context: DataContext) => {
    setCurrentContext(context);
  }, []);

  const playerDispatcher = useMemo(() => {
    return {
      pause,
      transferPlayback,
      playCollection,
      playCollectionTrack,
      playArtist,
      playTrackOnly,
    };
  }, [
    pause,
    transferPlayback,
    playCollection,
    playCollectionTrack,
    playArtist,
    playTrackOnly,
  ]);

  return (
    <PlayerContext.Provider
      value={{
        player,
        playerDispatcher,
        currentContext,
        setSpotifyContext,
        isActive,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
