import axios from "axios";
import { get } from "./get";
import { put } from "./put";
import { post } from "./post";

export const spotifyAxios = (token: string) =>
  axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const spotifyAPI = {
  ...get,
  ...put,
  ...post,
};
