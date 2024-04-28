import React, { useState, useEffect, useCallback } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';
import axios from 'axios';

const spotify_client_id = '4570d2b0ba074a3da9a6ff13fd3643fa';
const spotify_redirect_uri = 'http://localhost:3000';

function App() {
	const [token, setToken] = useState('')
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
	}, []);

	return (
		<>
			{token === '' || token === null ? (
				<Login
					clientId={spotify_client_id}
					redirectUri={spotify_redirect_uri}
				/>
			) : (
				<WebPlayback client_id={spotify_client_id} onTokenRefreshed={(token) => setToken(token)}/>
			)}
		</>
	);
}

export default App;
