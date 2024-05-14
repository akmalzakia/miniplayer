import axios from "axios";
import { get } from "./get";
import { put } from "./put";

export const spotifyAxios = (token) => axios.create({
  baseURL:'https://api.spotify.com/v1',
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const spotifyAPI = {
  ...get,
  ...put
}