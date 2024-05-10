import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const TokenContext = createContext("");

export function TokenProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const url = "https://accounts.spotify.com/api/token";
  const refreshOffset = 10; // in minutes

  useEffect(() => {
    async function requestRefresh() {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refreshing token...");
      await axios
        .post(
          url,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          const data = res.data;
          const newToken = data.access_token;
          const refreshToken = data.refresh_token;
          const expire = data.expires_in;
          const expires_in_epoch = data.expires_in * 1000 + Date.now();

          setTimeout(() => {
            requestRefresh();
          }, (expire - refreshOffset * 60) * 1000);

          localStorage.setItem("access_token", newToken);
          localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("expires_in", expires_in_epoch);
          setToken(newToken);
        })
        .catch((err) => {
          console.log("error refresh :", err);
        });
    }

    let refreshTimeout;
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken) return;
    const expires_in_epoch = localStorage.getItem("expires_in");
    const refreshOffsetMs = refreshOffset * 60 * 1000;
    const time_to_refresh = expires_in_epoch - Date.now() - refreshOffsetMs;
    console.log("refreshing in :", time_to_refresh);
    if (time_to_refresh < 0) {
      requestRefresh();
    } else {
      refreshTimeout = setTimeout(() => {
        requestRefresh();
      }, time_to_refresh);
    }

    return () => {
      clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}
