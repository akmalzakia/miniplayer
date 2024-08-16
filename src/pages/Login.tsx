import utils from "../utils/util";
import spotifyImg from "../assets/Spotify_Logo_CMYK_White.png";

function Login() {
  async function handleLogin() {
    const scope =
      "streaming user-read-email user-read-private playlist-read-collaborative playlist-read-private user-read-playback-state user-modify-playback-state";
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
    <div className='w-full h-full bg-spotify-black'>
      <header className='w-full h-full flex'>
        <div className='flex flex-col p-4 m-auto w-1/3 justify-between gap-10'>
          <div>
            <div className='font-bold text-2xl text-spotify-green mb-3'>
              Important
            </div>
            <p>
              For anyone that want to access the website, you can use this
              account
            </p>
            <div className='py-2'>
              <p>Email : de2602990@gmail.com</p>
              <p>Password : KW(uWT\519q;G.m|</p>
            </div>
            <p>
              You can&apos;t access the webplayer though, since it is not a
              premium user. If you would like to use your own (premium) account,
              feel free to contact me at{" "}
              <a
                href='mailto:zakiasmara11@gmail.com'
                className='text-spotify-green'
              >
                zakiasmara11@gmail.com
              </a>{" "}
              or <span>(+62) 81336427692</span>
            </p>
          </div>
          <button
            className='bg-spotify-green py-3 px-5 rounded-full'
            onClick={handleLogin}
          >
            Login with{" "}
            <img
              src={spotifyImg}
              className='inline w-20 ml-2'
            ></img>
          </button>
        </div>
      </header>
    </div>
  );
}

export default Login;
