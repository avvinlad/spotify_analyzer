import { useEffect, useState, FC } from 'react';
import useAuth from '../useAuth';
import Axios from 'axios';
import Playlist from './Playlist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Code = {
	code: string;
};

type Playlist = {
	id: string;
	name: string;
	image: string;
};

const Dashboard: FC<Code> = ({ code }) => {
	let accessToken = useAuth(code);
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
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
					setPlaylists(res.data.items.map(parsePlaylistData));
				})
				.catch(() => {
					window.location.href = '/';
				});
		}
	}, [accessToken]);

	function parsePlaylistData(data: any): Playlist {
		return {
			id: data.id,
			name: data.name,
			image:
				data.images.length > 1
					? data.images[1].url
					: data.images.length > 0
					? data.images[0].url
					: 'No Image'
		};
	}

	if (playlists.length > 0) {
		playlists.forEach((playlist: any) => {
			plNames.push(
				<div
					key={playlist.id}
					className="flex-row self-center p-6 h-full"
				>
					<Card className="h-full">
						<CardHeader>
							<CardTitle>
								<div className="text-xl">
									<p>{playlist.name}</p>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex justify-center mb-5">
							<a
								key={playlist.id}
								id={playlist.id}
								href={`/playlist/${playlist.id}`}
							>
								<img
									className="flex justify-center self-center rounded-md"
									key={playlist.id}
									id={playlist.id}
									height={300}
									src={playlist.image}
									alt={playlist.name}
								/>
							</a>
						</CardContent>
					</Card>
				</div>
			);
		});
	}

	return (
		<div className="container">
			<div>
				<h1 className="font-extrabold text-4xl text-center my-8">
					Playlist Dashboard
				</h1>
			</div>
			<div>
				<div className="grid grid-cols-3 justify-center">
					{playlists ? plNames : 'No Playlists'}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
