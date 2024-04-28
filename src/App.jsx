import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';
import axios from 'axios';

const spotify_client_id = '4570d2b0ba074a3da9a6ff13fd3643fa';
const spotify_redirect_uri = 'http://localhost:3000';

function App() {
  const token = localStorage.getItem('token')
	useEffect(() => {
		async function requestToken() {
			const codeVerifier = localStorage.getItem('code_verifier');
			const authCode = new URLSearchParams(window.location.search).get(
				'code'
			);

      console.log("auth",authCode)

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
        localStorage.setItem('token', res.data.access_token)
        console.log(res)
      }).catch(err => {
        console.log(err)
        console.log("verifier", codeVerifier)
      })
		}

		if (token == '' || token == null) {
      console.log('request Token')
			requestToken();
		}
    console.log(token)
	}, []);

	return (
		<>
			{token === '' || token === null ? (
				<Login
					clientId={spotify_client_id}
					redirectUri={spotify_redirect_uri}
				/>
			) : (
				<WebPlayback token={token} />
			)}
		</>
	);
}

export default App;
