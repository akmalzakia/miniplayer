import { createElement } from "react";

const SpotifyScript = () => {
  const script = createElement("script", {
    id: "spotify-player",
    type: "text/javascript",
    async: false,
    defer: true,
    src: "https://sdk.scdn.co/spotify-player.js",
    onLoad: () => {
      console.log("Spotify loaded");
    },
    onError: console.error,
  });

  console.log("test");

  return script;
};

export default SpotifyScript;
