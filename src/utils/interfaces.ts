import { PlayerStateContext, Track } from "../api/base";

export interface DataContext {
  context: Spotify.PlaybackContext | PlayerStateContext;
  paused: boolean;
  current_track?: Spotify.Track | Track;
  device?: {
    id: string;
    name: string;
  };
}

export interface UserContextType {
  user: SpotifyApi.UserObjectPrivate | null;
  isLoading: boolean;
}