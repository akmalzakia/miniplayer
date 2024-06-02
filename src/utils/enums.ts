export enum SpotifyObjectType {
  Album = 'album',
  Artist = 'artist',
  Playlist = 'playlist'
}
export enum CollectionType {
  Album = SpotifyObjectType.Album,
  Playlist = SpotifyObjectType.Playlist,
}

export enum PaginatedRequestMode {
  Next,
  Previous
}

export enum AlbumGroup {
  Album = 'album',
  Single = 'single',
  AppearsOn = 'appears_on',
  Compilation = 'compilation',
  All = 'album,single,appears_on,compilation'
}

export enum PlayMode {
  Collection,
  CollectionTrack,
  TrackOnly
}