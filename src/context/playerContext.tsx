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
import useUserContext from "../hooks/Context/useUserContext";
import { isAxiosError } from "axios";
import PlayWarningModal from "../component/Modals/PlayWarningModal";
import useModalContext from "../hooks/Context/useModalContext";

interface PlayerContextType {
  player: {
    id: string;
    instance: Spotify.Player | null;
  };
  playerDispatcher: {
    pause(): Promise<void>;
    transferPlayback(): Promise<void>;
    playCollection(
      collection:
        | SpotifyApi.AlbumObjectFull
        | SpotifyApi.PlaylistObjectFull
        | SpotifyApi.PlaylistObjectSimplified
        | SpotifyApi.AlbumObjectSimplified,
      isTrackOnCollection: boolean
    ): Promise<void>;
    playCollectionTrack(collectionUri: string, trackUri: string): Promise<void>;
    playArtist(artistUri: string, isTrackOnTopTracks: boolean): Promise<void>;
    playTrackOnly(trackUri: string): Promise<void>;
    playTrack(trackUri?: string, collectionUri?: string): void;
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
  const { openModal } = useModalContext();
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

    return () => {
      if (playerInstance) {
        console.log("disconnecting");
        playerInstance.disconnect();
      }
    };
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
      collection:
        | SpotifyApi.AlbumObjectFull
        | SpotifyApi.PlaylistObjectFull
        | SpotifyApi.AlbumObjectSimplified,
      isTrackOnCollection: boolean
    ) => {
      if (player.instance && isActive && isTrackOnCollection) {
        player.instance.resume();
        return;
      }

      const state = await spotifyAPI.getPlayerState(token);

      if (isTrackOnCollection && state) {
        try {
          const { progress_ms, item } = state;
          const data = {
            context_uri: collection.uri,
            offset: {
              uri: item?.uri,
            },
            position_ms: progress_ms,
          };

          await spotifyAPI.playPlayer(token, data).then(() => {
            setCurrentContext((ctx) => (ctx ? { ...ctx, paused: false } : ctx));
          });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
          }
        }
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
            setCurrentContext((ctx) => (ctx ? { ...ctx, paused: false } : ctx));
          });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
          }
        }
      }
    },
    [isActive, player, token, openModal, transferPlayback]
  );

  const playCollectionTrack = useCallback(
    async (collectionUri: string, trackUri: string) => {
      const isSameContext = collectionUri === currentContext?.context?.uri;
      const isCurrentTrack = trackUri === currentContext?.current_track?.uri;
      if (player.instance && isActive && isCurrentTrack && isSameContext) {
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
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
          }
        }
      }
    },
    [currentContext, isActive, player, token, openModal, transferPlayback]
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
            setCurrentContext((ctx) => (ctx ? { ...ctx, paused: false } : ctx));
          });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
          }
        }
      }
    },
    [isActive, player, token, openModal, transferPlayback]
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
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
          }
        }
      }
    },
    [currentContext, isActive, player, token, openModal, transferPlayback]
  );

  const playTrack = useCallback(
    (trackUri?: string, collectionUri?: string) => {
      if (!trackUri) return;

      if (!currentContext) {
        openModal(<PlayWarningModal transferPlayback={transferPlayback} />);
        return;
      }

      if (collectionUri) {
        playCollectionTrack(collectionUri, trackUri);
      } else {
        playTrackOnly(trackUri);
      }
    },
    [
      currentContext,
      openModal,
      playCollectionTrack,
      playTrackOnly,
      transferPlayback,
    ]
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
      playTrack,
    };
  }, [
    pause,
    transferPlayback,
    playCollection,
    playCollectionTrack,
    playArtist,
    playTrackOnly,
    playTrack,
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
