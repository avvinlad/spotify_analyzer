import { FC } from 'react';
import Login from './Login';
import Dashboard from './screens/Dashboard';
import Playlist from './screens/PlaylistView';
import Error from './screens/Error';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const code: string =
	new URLSearchParams(window.location.search).get('code') ?? '';

const App: FC = () => {
	return (
		<div className="flex container justify-center mx-auto">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={code ? <Dashboard code={code} /> : <Login />}
					/>
					<Route
						path="/playlist/:playlistID"
						element={<Playlist />}
					/>
					<Route path="*" element={<Error />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
