import { createContext, useEffect, useState } from "react";

export const PlayerContext = createContext("");

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [isActive, setIsActive] = useState(false);

  const defaultVolume = 0.5;

  useEffect(() => {
    function onSDKReady() {
      console.log("currentPlayer", player);
      if (player) return;
      console.log("trying to create new player");
      const newPlayer = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(localStorage.getItem("access_token"));
        },
        volume: defaultVolume,
      });

      function onDeviceOnline({ device_id }) {
        console.log("Ready with device ID", device_id);
        setPlayer(newPlayer);
        setPlayerId(device_id);
      }

      function onDeviceOffline({ device_id }) {
        console.log("Device ID has gone offline", device_id);
        setPlayer(null);
        setIsActive(false);
        setPlayerId("");
      }

      function onStateChange(state) {
        if (!state) {
          return;
        }

        if (
          !state.playback_id &&
          !state.playback_speed &&
          state.playback_quality === "UNKNOWN"
        ) {
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

    window.onSpotifyWebPlaybackSDKReady = onSDKReady;
    return () => {
      window.onSpotifyWebPlaybackSDKReady = null;
    };
  }, [player]);

  return (
    <PlayerContext.Provider value={{ player, playerId, isActive }}>
      {children}
    </PlayerContext.Provider>
  );
}
