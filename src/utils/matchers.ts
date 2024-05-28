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
    | SpotifyApi.AlbumObjectSimplified
): data is SpotifyApi.PlaylistObjectFull {
  return (data as SpotifyApi.PlaylistObjectFull).type === "playlist";
}

function isAlbum(
  data:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectSimplified
): data is SpotifyApi.AlbumObjectSimplified {
  return (data as SpotifyApi.AlbumObjectSimplified).type === "album";
}



export {
  isPlaylist,
  isPlaylistTrack,
  isAlbum
}