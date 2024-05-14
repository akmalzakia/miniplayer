import { spotifyAxios } from "./spotifyAxios";

async function playPlayer(token, data) {
  const res = spotifyAxios(token).put(
    "https://api.spotify.com/v1/me/player/play",
    data
  );
  return res.data;
}

async function pausePlayer(token) {
  const res = spotifyAxios(token).put(
    "https://api.spotify.com/v1/me/player/pause"
  );
  return res.data;
}

const put = {
  playPlayer,
  pausePlayer,
};

export { put };
