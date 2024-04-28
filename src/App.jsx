import React, { useState, useEffect, useCallback } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';
import { useToken } from './hooks/useToken';

const spotify_client_id = '4570d2b0ba074a3da9a6ff13fd3643fa';
const spotify_redirect_uri = 'http://localhost:3000';

function App() {
	const [token, setToken] = useToken()

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
