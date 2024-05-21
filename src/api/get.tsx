import { PlaybackStateAPI } from "./base";
import { spotifyAxios } from "./spotifyAxios";

//#region User

async function getCurrentUser(token: string) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.CurrentUsersProfileResponse>(`/me`);
  return res.data;
}

async function getUserById(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.UserProfileResponse>(
    `/users/${id}`
  );
  return res.data;
}
//#endregion
//#region Playlist
async function getPlaylistWithId(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.SinglePlaylistResponse>(
    `/playlists/${id}`
  );
  return res.data;
}

async function getFeaturedPlaylists(
  token: string,
  params: {
    locale: string;
    limit: number;
    offset: number;
  }
) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.ListOfFeaturedPlaylistsResponse>(
    `/browse/featured-playlists`,
    {
      params: params,
    }
  );
  return res.data;
}

async function getUserPlaylists(
  token: string,
  params: {
    limit: number;
    offset: number;
  }
) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(`/me/playlists`, {
    params: params,
  });
  return res.data;
}
//#endregion Playlist
//#region Album
async function getAlbumWithId(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.SingleAlbumResponse>(
    `/albums/${id}`
  );
  return res.data;
}
//#endregion
//#region Artist
async function getArtistById(id:string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.SingleArtistResponse>(`/artists/${id}`)
  return res.data
}
//#endregion
//#region Player

async function getPlayerState(token: string) {
  const res = await spotifyAxios(token).get<PlaybackStateAPI>(`/me/player`);
  return res.data;
}
//#endregion


const get = {
  getCurrentUser,
  getUserById,
  getPlaylistWithId,
  getFeaturedPlaylists,
  getUserPlaylists,
  getAlbumWithId,
  getArtistById,
  getPlayerState,
};

export { get };
