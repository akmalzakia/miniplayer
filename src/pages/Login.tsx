import utils from "../utils/util";
import spotifyImg from "../assets/Spotify_Logo_CMYK_White.png";

function Login() {
  async function handleLogin() {
    const scope =
      "streaming user-read-email user-read-private playlist-read-collaborative playlist-read-private user-read-playback-state";
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const codeVerifier = utils.generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);
    const hashed = await utils.sha256(codeVerifier);
    const codeChallenge = utils.base64encode(hashed);

    const queryParam = {
      response_type: "code",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    };
    authUrl.search = new URLSearchParams(queryParam).toString();
    window.location.href = authUrl.toString();
  }

  return (
    <div className='w-full h-full'>
      <header className='w-full h-full flex'>
        <button
          className='bg-spotify-green py-3 px-5 rounded-full m-auto'
          onClick={handleLogin}
        >
          Login with{" "}
          <img
            src={spotifyImg}
            className='inline w-20 ml-2'
          ></img>
        </button>
      </header>
    </div>
  );
}

export default Login;
