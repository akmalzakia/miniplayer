function isPlaylistTrack(
  item: SpotifyApi.TrackObjectSimplified | SpotifyApi.PlaylistTrackObject
): item is SpotifyApi.PlaylistTrackObject {
  return (item as SpotifyApi.PlaylistTrackObject).track !== undefined;
}


function isPlaylist(
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.ArtistObjectSimplified
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.AlbumObjectSimplified
): data is SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified {
  return (data as SpotifyApi.PlaylistObjectSimplified).type === "playlist";
}

function isAlbum(
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.ArtistObjectSimplified
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.AlbumObjectSimplified
): data is SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified {
  return (data as SpotifyApi.AlbumObjectSimplified).type === "album";
}

function isArtist(
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.ArtistObjectSimplified
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.AlbumObjectSimplified
): data is SpotifyApi.ArtistObjectFull | SpotifyApi.ArtistObjectSimplified {
  return (data as SpotifyApi.ArtistObjectSimplified).type === "artist";
}

function isFullTrack(
  track: SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified
): track is SpotifyApi.TrackObjectFull {
  return !!(track as SpotifyApi.TrackObjectFull).album;
}

export { isPlaylist, isPlaylistTrack, isAlbum, isArtist, isFullTrack };
