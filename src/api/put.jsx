import { spotifyAxios } from "./spotifyAxios";

async function playPlayer(token, data) {
  const res = spotifyAxios(token).put("/me/player/play", data);
  return res.data;
}

async function pausePlayer(token) {
  const res = spotifyAxios(token).put("/me/player/pause");
  return res.data;
}

async function transferPlayback(token, data) {
  const res = spotifyAxios(token).put("/me/player", data);
  return res.data;
}

const put = {
  playPlayer,
  pausePlayer,
  transferPlayback
};

export { put };
