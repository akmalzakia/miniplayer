import { useEffect } from "react";
import usePlayerContext from "./usePlayerContext";
import { DataContext } from "../utils/interfaces";
import { spotifyAPI } from "../api/spotifyAxios";

function usePlayerStateFetcher(token: string, dependency?: object | null) {
  const { player, setSpotifyContext, isActive } = usePlayerContext();
  useEffect(() => {
    async function requestPlayerState() {
      console.log("requesting player state...");
      try {
        let data: DataContext;
        if (player.instance && isActive) {
          const res = await player.instance.getCurrentState();

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
        }
        setSpotifyContext(data);
      } catch (err) {
        console.log(err);
      }
    }

    requestPlayerState();
  }, [player, isActive, token, setSpotifyContext, dependency]);
}

export default usePlayerStateFetcher;
