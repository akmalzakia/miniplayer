import { spotifyAxios } from "./spotifyAxios";

async function playPlayer(
  token: string,
  data: {
    context_uri?: string;
    uris?: string[];
    offset?: {
      uri?: string;
      position?: number;
    };
    position_ms: number;
  }
) {
  const res = await spotifyAxios(token).put("/me/player/play", data);
  return res.data;
}

async function pausePlayer(token: string) {
  const res = await spotifyAxios(token).put("/me/player/pause");
  return res.data;
}

async function transferPlayback(
  token: string,
  data: {
    device_ids: string[];
    play?: boolean;
  }
) {
  const res = await spotifyAxios(token).put("/me/player", data);
  return res.data;
}

const put = {
  playPlayer,
  pausePlayer,
  transferPlayback,
};

export { put };
