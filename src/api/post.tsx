import axios from "axios";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

async function refreshToken(refreshToken: string) {
  const res = await axios.post<TokenResponse>(
    "https://accounts.spotify.com/api/token",
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
  );
  return res.data;
}

const post = {
  refreshToken,
};

export { post };
