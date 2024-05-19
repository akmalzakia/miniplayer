import { PlaybackStateAPI } from "./base";
import { spotifyAxios } from "./spotifyAxios";

async function getPlaylistWithId(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.SinglePlaylistResponse>(
    `/playlists/${id}`
  );
  return res.data;
}

async function getPlayerState(token: string) {
  const res = await spotifyAxios(token).get<PlaybackStateAPI>(`/me/player`);
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

async function getCurrentUser(token: string) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.CurrentUsersProfileResponse>(`/me`);
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

const get = {
  getPlaylistWithId,
  getPlayerState,
  getUserPlaylists,
  getCurrentUser,
  getFeaturedPlaylists,
};

export { get };
