export enum SpotifyObjectType {
  Album = 'album',
  Artist = 'artist',
  Playlist = 'playlist'
}
export enum CollectionType {
  Album = SpotifyObjectType.Album,
  Playlist = SpotifyObjectType.Playlist,
}


export enum AlbumGroup {
  Album = 'album',
  Single = 'single',
  AppearsOn = 'appears_on',
  Compilation = 'compilation'
}

export enum PlayMode {
  Collection,
  CollectionTrack,
  TrackOnly
}