interface ExternalUrls {
  spotify: string;
}

interface Restrictions {
  reason: string;
}

interface ExternalIds {
  isrc: string;
  ean: string;
  upc: string;
}

interface Followers {
  href?: string;
  total: number;
}

export interface PlaylistOwner {
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name?: string;
}

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export interface SimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SimplifiedPlaylist {
  collaborative: boolean;
  description?: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: PlaylistOwner;
  public: boolean;
  snapshot_id: string;
  tracks?: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface Track {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: SimplifiedArtist[];
  };
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  externalUrlsBase: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface PlaylistTrack {
  added_at: string;
  added_by: PlaylistOwner;
  is_local: boolean;
  track: Track;
}

export interface Playlist {
  collaborative: boolean;
  description?: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: PlaylistOwner;
  public: boolean;
  snapshot_id: string;
  tracks: IterableSpotifyObject<PlaylistTrack>;
  type: string;
  uri: string;
}

export interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface IterableSpotifyObject<T> {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: T[];
}

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent?: number;
  supports_volume: boolean;
}

export interface PlayerStateContext {
  type: string;
  href: string;
  external_urls: ExternalUrls;
  uri: string;
}

export interface PlayerActions {
  interrupting_playback: boolean;
  pausing: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_shuffle: boolean;
  toggling_repeat_track: boolean;
  transferring_playback: boolean;
}

export interface PlaybackStateAPI {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: PlayerStateContext;
  timestamp: number;
  progress_ms: number;
  is_playing: number;
  item?: Track;
  current_platying_type: string;
  actions: PlayerActions;
}
