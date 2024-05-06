import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { ClientContext } from "./clientContext";

export const TokenContext = createContext("");

export function TokenProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const { id, redirectUri } = useContext(ClientContext);
  const url = "https://accounts.spotify.com/api/token";
  const refreshOffset = 10; // in minutes

  const requestRefresh = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("refreshing token...");
    await axios
      .post(
        url,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: id,
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
  }, [id]);

  const requestToken = useCallback(async () => {
    const codeVerifier = localStorage.getItem("code_verifier");
    const authCode = new URLSearchParams(window.location.search).get("code");

    if (authCode === null) return;

    console.log("requesting token...");

    axios
      .post(
        url,
        {
          client_id: id,
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
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

        const d = new Date(Date.now());

        console.log("first token at:", d);

        setTimeout(() => {
          requestRefresh();
        }, (expire - refreshOffset * 60) * 1000);

        const expires_in_epoch = data.expires_in * 1000 + Date.now();

        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("expires_in", expires_in_epoch);

        setToken(newToken);
      })
      .catch((err) => {
        console.log("auth", err);
      });
  }, [id, redirectUri, requestRefresh]);

  useEffect(() => {
    console.log("tokenContext effect");
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken) {
      requestToken();
    }
  }, [requestToken]);

  useEffect(() => {
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
  }, [requestRefresh]);

  return (
    <TokenContext.Provider value={{ token, requestRefresh }}>
      {children}
    </TokenContext.Provider>
  );
}
