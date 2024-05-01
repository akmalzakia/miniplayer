import { useContext } from 'react';
import { base64encode, generateRandomString, sha256 } from './utils/util';
import { ClientContext } from './context/clientContext';

function Login() {
    const { id, redirectUri} = useContext(ClientContext)
    async function handleLogin() {
        const scope = 'streaming user-read-email user-read-private'
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        const codeVerifier = generateRandomString(64);
        localStorage.setItem('code_verifier', codeVerifier)
        console.log(codeVerifier)
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);

        const queryParam = {
            response_type: 'code',
            client_id: id,
            scope: scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }
        authUrl.search = new URLSearchParams(queryParam).toString();
        window.location.href = authUrl.toString()
    }

    return (
        <div className="App">
            <header className="App-header">
                <button className="btn-spotify" onClick={handleLogin} >
                    Login with Spotify
                </button>
            </header>
        </div>
    );
}

export default Login;