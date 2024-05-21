import axios from "axios";

interface Params {
  request: Request
}

const requestToken = async ({ request } : Params) => {
  const codeVerifier = localStorage.getItem("code_verifier");
  const url = new URL(request.url);
  const authCode = url.searchParams.get("code");

  if (authCode === null) return null;

  console.log("requesting token...");
  let tokenDetails = {};
  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        code_verifier: codeVerifier,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const newToken = data.access_token;
    const refreshToken = data.refresh_token;
    const d = new Date(Date.now());

    console.log("first token at:", d);

    const expires_in_epoch = data.expires_in * 1000 + Date.now();

    tokenDetails = {
      newToken,
      refreshToken,
      expires_in_epoch,
    };

    localStorage.setItem("access_token", newToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("expires_in", expires_in_epoch.toString());
    return tokenDetails;
  } catch (err) {
    console.log("auth", err);
    return {};
  }
};

export default requestToken;
