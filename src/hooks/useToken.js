import { useEffect, useState } from "react";
import axios from 'axios';

export function useToken() {
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  useEffect(() => {
    async function requestToken() {
      const codeVerifier = localStorage.getItem('code_verifier');
      const authCode = new URLSearchParams(window.location.search).get(
        'code'
      );

      if (authCode === null) return

      axios.post(
        'https://accounts.spotify.com/api/token',
        {
          client_id: spotify_client_id,
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: spotify_redirect_uri,
          code_verifier: codeVerifier,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ).then((res) => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        setToken(res.data.access_token)
      }).catch(err => {
        console.log(err)
      })
    }
    if (!token) {
      requestToken();
    }
  }, [])

  return [token, setToken]
}