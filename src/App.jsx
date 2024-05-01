import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';
import { useContext } from 'react';
import { TokenContext } from './context/tokenContext';



function App() {
	const { token } = useContext(TokenContext)
	return (
		<>
			{token === '' || token === null ? (
				<Login />
			) : (
				<WebPlayback />
			)}
		</>
	);
}

export default App;
