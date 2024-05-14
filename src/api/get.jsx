import { spotifyAxios } from "./spotifyAxios";

async function getPlaylistWithId(id, token) {
  const res = await spotifyAxios(token).get(`/playlists/${id}`);
  return res.data;
}

async function getPlayerState(token) {
  const res = await spotifyAxios(token).get(`/me/player`);
  return res.data;
}

async function getUserPlaylists(token, params) {
  const res = await spotifyAxios(token).get(`/me/playlists`, {
    params: params
  });
  return res.data;
}

async function getCurrentUser(token) {
  const res = await spotifyAxios(token).get(`/me`);
  return res.data;
}

async function getFeaturedPlaylists(token, params) {
  const res = await spotifyAxios(token).get(`/browse/featured-playlists`, {
    params: params
  });
  return res.data;
}



const get = {
  getPlaylistWithId,
  getPlayerState,
  getUserPlaylists,
  getCurrentUser,
  getFeaturedPlaylists
}

export { get }
