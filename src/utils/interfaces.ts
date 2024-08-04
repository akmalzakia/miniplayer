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

export interface ArtistAlbumParams {
  include_groups: string[];
  limit: number;
  offset: number;
}

export interface SearchParams {
  query: string;
  type: ("album" | "artist" | "playlist" | "track")[];
  limit?: number;
  offset?: number;
}
