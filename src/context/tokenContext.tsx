import React, { createContext, useEffect, useState } from "react";
import { spotifyAPI } from "../api/spotifyAxios";

export const TokenContext = createContext("");

interface Props {
  children?: React.ReactNode;
}

export function TokenProvider({ children }: Props) {
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );
  const refreshOffset = 10; // in minutes

  useEffect(() => {
    async function requestRefresh() {
      let refreshToken = localStorage.getItem("refresh_token") || "";
      console.log("refreshing token...");

      try {
        const data = await spotifyAPI.refreshToken(refreshToken);

        const newToken = data.access_token;
        const expire = data.expires_in;
        const expires_in_epoch = data.expires_in * 1000 + Date.now();

        refreshToken = data.refresh_token;

        setTimeout(() => {
          requestRefresh();
        }, (expire - refreshOffset * 60) * 1000);

        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("expires_in", expires_in_epoch.toString());
        setToken(newToken);
      } catch (error) {
        console.log("error refresh :", error);
      }
    }

    let refreshTimeout: number;
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken) return;
    const expires_in_epoch = parseInt(localStorage.getItem("expires_in") || "");
    const refreshOffsetMs = refreshOffset * 60 * 1000;
    const time_to_refresh = expires_in_epoch - Date.now() - refreshOffsetMs;
    console.log("refreshing in :", time_to_refresh);
    if (time_to_refresh < 0) {
      requestRefresh();
    } else {
      refreshTimeout = window.setTimeout(() => {
        requestRefresh();
      }, time_to_refresh);
    }

    return () => {
      window.clearTimeout(refreshTimeout);
    };
  }, []);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}
