import { ArtistAlbumParams, SearchParams } from "../utils/interfaces";
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

async function getAlbumTracks(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.AlbumTracksResponse>(
    `/albums/${id}/tracks`
  );
  return res.data;
}
//#endregion
//#region Artist

async function getArtistById(id: string, token: string) {
  const res = await spotifyAxios(token).get<SpotifyApi.SingleArtistResponse>(
    `/artists/${id}`
  );
  return res.data;
}

async function getArtistTopTracks(id: string, token: string) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.ArtistsTopTracksResponse>(`/artists/${id}/top-tracks`);
  return res.data.tracks;
}

async function getArtistAlbums(
  id: string,
  params: ArtistAlbumParams,
  token: string
) {
  const res = await spotifyAxios(token).get<SpotifyApi.ArtistsAlbumsResponse>(
    `artists/${id}/albums`,
    {
      params: {
        include_groups: params.include_groups.map((group) => group).join(","),
        limit: params.limit,
        offset: params.offset,
      },
    }
  );
  return res.data;
}

async function getRelatedArtists(id: string, token: string) {
  const res = await spotifyAxios(
    token
  ).get<SpotifyApi.ArtistsRelatedArtistsResponse>(
    `artists/${id}/related-artists`
  );
  return res.data.artists;
}
//#endregion
//#region Player

async function getPlayerState(token: string) {
  const res = await spotifyAxios(token).get<PlaybackStateAPI>(`/me/player`);
  return res.data;
}
//#endregion

//#region Search
async function search(params: SearchParams, token: string) {
  const res = await spotifyAxios(token).get<
    Omit<SpotifyApi.SearchResponse, "shows" | "episodes">
  >(`/search`, {
    params: {
      q: params.query,
      type: params.type.join(","),
      limit: params.limit,
      offset: params.offset,
    },
  });

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
  getAlbumTracks,
  getArtistById,
  getArtistTopTracks,
  getArtistAlbums,
  getRelatedArtists,
  getPlayerState,
  search,
};

export { get };
