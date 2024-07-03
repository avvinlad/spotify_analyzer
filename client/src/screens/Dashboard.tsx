import { useEffect, useState, FC } from 'react';
import useAuth from '../useAuth';
import Axios from 'axios';

type Code = {
	code: string;
};

const Dashboard: FC<Code> = ({ code }) => {
	let accessToken = useAuth(code);
	const [playlists, setPlaylists] = useState([]);
	const plNames: any = [];

	if (!accessToken) {
		accessToken = sessionStorage.getItem('accessToken') ?? '';
	}

	useEffect(() => {
		if (accessToken) {
			Axios.get('http://localhost:3001/getPlaylists', {
				params: { accessToken: accessToken }
			})
				.then((res) => {
					setPlaylists(res.data.items);
				})
				.catch(() => {
					window.location.href = '/';
				});
		}
	}, [accessToken]);

	if (playlists.length > 0) {
		playlists.forEach((playlist: any) => {
			plNames.push(
				<div key={playlist.id} style={{ padding: '10px' }}>
					<a
						key={playlist.id}
						id={playlist.id}
						href={`/playlist/${playlist.id}`}
						style={{ margin: '10px' }}
					>
						<img
							key={playlist.id}
							id={playlist.id}
							src={playlist.images[0].url}
							alt="album artwork"
							style={{ maxHeight: '175px', maxWidth: '175px' }}
						/>
					</a>
					<div>
						<p>{playlist.name}</p>
					</div>
				</div>
			);
		});
	}

	return (
		<div>
			<div>
				<h1>Playlist Dashboard</h1>
			</div>
			<div>
				<div>{playlists ? plNames : 'No Playlists'}</div>
			</div>
		</div>
	);
};

export default Dashboard;
