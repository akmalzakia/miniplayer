import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./userContext";

interface PlayerContextType {
  player?: Spotify.Player | null;
  playerId: string;
  isActive: boolean;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayerContext = () => {
  const obj = useContext(PlayerContext);
  if (!obj) {
    throw new Error("usePlayerContext must be used within a Provider");
  }
  return obj;
};

export function PlayerProvider({ children }: PropsWithChildren) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [isActive, setIsActive] = useState(false);

  const { user, isLoading } = useUserContext();

  const defaultVolume = 0.5;

  useEffect(() => {
    function onSDKReady() {
      console.log("currentPlayer", player);
      if (player) return;
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
        setPlayer(newPlayer);
        setPlayerId(device_id);
      }

      function onDeviceOffline({ device_id }: Spotify.WebPlaybackInstance) {
        console.log("Device ID has gone offline", device_id);
        setPlayer(null);
        setIsActive(false);
        setPlayerId("");
      }

      function onStateChange(state: Spotify.PlaybackState) {
        if (!state) {
          return;
        }

        if (!state.playback_id && state.playback_quality === "UNKNOWN") {
          newPlayer.disconnect();
          setIsActive(false);
          setPlayer(null);
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
  }, [player, user]);

  return (
    <PlayerContext.Provider value={{ player, playerId, isActive }}>
      {children}
    </PlayerContext.Provider>
  );
}
