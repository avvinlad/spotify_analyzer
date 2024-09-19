import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
	sortTracksAscending,
	sortTracksDescending,
	formatArtists,
	formatDuration
} from '../helpers/trackHelper';
import Axios from 'axios';

interface PlaylistObj {
	id: string;
	name: string;
	description: string;
	uri: string;
	total: number;
	image: string;
	owner: {
		name: string;
		link: string;
	};
	public: boolean;
	duration: number;
}

interface Track {
	id: string;
	name: string;
	artists: object[];
	dateAdded: string;
	tempo: number;
	acoustics: number;
	valence: number;
	energy: number;
	danceability: number;
	mode: number;
	key: number;
	selected: boolean;
}

interface Artist {
	id: string;
	name: string;
}

const Playlist: FC = () => {
	const { playlistID } = useParams();
	const [tracks, setTracks] = useState<Track[]>([]);
	const [playlist, setPlaylist] = useState<PlaylistObj>();
	const [sortTracksOrder, setSortTracksOrder] = useState(1);
	const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
	const accessToken = sessionStorage.getItem('accessToken');

	const sortOrder = (filter: string) => sortTracks(filter);

	useEffect(() => {
		if (accessToken && playlistID) {
			Axios.get('http://localhost:3001/getPlaylistInfo', {
				params: { accessToken, playlistID }
			})
				.then((res) => {
					const playlist: PlaylistObj = {
						id: res.data.id,
						name: res.data.name,
						description: res.data.description,
						uri: res.data.uri,
						total: res.data.tracks.total,
						image:
							res.data.images.length > 1
								? res.data.images[1].url
								: res.data.images.length > 0
								? res.data.images[0].url
								: 'No Image Found',
						owner: {
							name: res.data.owner.display_name,
							link: res.data.owner.href
						},
						public: res.data.public,
						duration: res.data.tracks.items.reduce(
							(total: number, curTrack: any) =>
								total + curTrack.track.duration_ms,
							0
						)
					};
					setPlaylist(playlist);
				})
				.catch(() => {
					console.log(`Error gathering playlist information.`);
					window.location.href = '/';
				});
		}
	}, [accessToken, playlistID]);

	useEffect(() => {
		if (playlist && tracks && tracks.length < playlist.total) {
			const totalTracks = playlist?.total;
			Axios.get('http://localhost:3001/getPlaylistTracks', {
				params: { accessToken, playlistID, totalTracks }
			})
				.then((res) => {
					formatTracks(res.data);
				})
				.catch(() => {
					window.location.href = '/';
				});
		}
	});

	const handleChange = (track: Track) => {
		track.selected = !track.selected;
		if (!track.selected) {
			setSelectedTracks((selectedTracks) =>
				selectedTracks.filter((curTrack) => {
					return curTrack.id !== track.id;
				})
			);
		} else {
			const found = selectedTracks.findIndex(
				(curTrack) => curTrack.id === track.id
			);
			if (found === -1) {
				selectedTracks.push(track);
			}
		}
	};

	function formatTracks(resTracks: any) {
		let shapedTracks: Track[] = [];
		shapedTracks = resTracks.map((track: any) => ({
			id: track.track.id,
			name: track.track.name,
			artists: formatArtists(track.track.artists),
			dateAdded: track.added_at,
			tempo: 0,
			acoustics: 0,
			valence: 0,
			energy: 0,
			danceability: 0,
			mode: 0,
			key: 0
		}));
		audioFeatures(shapedTracks);
	}

	// async processes to retrieve all audio features
	async function audioFeatures(rawTracks: Track[]) {
		if (playlist) {
			const tracks = rawTracks.map((track) => track.id);
			const offsets = Math.floor(tracks.length / 100) + 1;
			const promises = [];
			let curTracks: string = '';
			for (let chunk = 0; chunk < offsets; chunk++) {
				curTracks = tracks
					.slice(chunk * 100, (chunk + 1) * 100)
					.join(',');
				promises.push(_getAudioFeatures(curTracks));
			}

			Promise.all(promises).then((response) => {
				let audioFeatures: any = [];
				response.forEach((audioFeature) => {
					audioFeatures = audioFeatures.concat(audioFeature);
				});
				addAudioFeatures(rawTracks, audioFeatures);
			});
		}
	}

	// get request for audio features
	async function _getAudioFeatures(tracksID: string) {
		const res = await Axios.get('http://localhost:3001/getTrackFeatures', {
			params: { accessToken, tracksID }
		});
		if (res.status !== 200) {
			return null;
		}
		return res.data;
	}

	// add audio features to state
	function addAudioFeatures(shapedTracks: Track[], audioFeatures: any) {
		const updatedTracks: Track[] = shapedTracks;
		if (!tracks && !audioFeatures) {
			return null;
		}
		if (updatedTracks.length !== audioFeatures.length) {
			return null;
		}
		updatedTracks.forEach((track) => {
			audioFeatures.forEach((feature: any) => {
				if (track.id === feature.id) {
					track.tempo = feature.tempo;
					track.acoustics = feature.acoustics;
					track.energy = feature.energy;
					track.valence = feature.valence;
					track.danceability = feature.danceability;
					track.mode = feature.mode;
					track.key = feature.key;
					track.selected = false;
				}
			});
		});
		setTracks(updatedTracks);
	}

	// function createPlaylist() {
	// 	let userID = 'avinladd';
	// 	let playlistName = 'API Playlist';
	// 	let playlistDesc = 'This is the API description';
	// 	Axios.post('http://localhost:3001/createPlaylist', {
	// 		accessToken,
	// 		userID,
	// 		playlistName,
	// 		playlistDesc,
	// 	});
	// }

	function sortTracks(filter: any) {
		const sortedTracks =
			sortTracksOrder === 0
				? sortTracksAscending(tracks, filter)
				: sortTracksDescending(tracks, filter);
		setTracks(sortedTracks);
		setSortTracksOrder((sortTracksOrder + 1) % 2);
	}

	function formatDate(date: string) {
		const datetime: Date = new Date(date);
		return datetime.toLocaleDateString();
	}

	// DISPLAY TRACKS
	function displayTracks() {
		if (!tracks) return '';

		let trackComp: any = [];
		trackComp = tracks.map((track: any) => (
			<TableRow key={track.id} className="px-8">
				<TableCell className="text-center">
					<Checkbox
						id={track.id}
						name={track.id}
						value={track.selected}
						onClick={() => handleChange(track)}
					/>
				</TableCell>
				<TableCell>{track.name}</TableCell>
				<TableCell>
					{track.artists
						.map((artist: Artist) => artist.name)
						.join(', ')}
				</TableCell>
				<TableCell className="text-center">{track.tempo}</TableCell>
				<TableCell className="text-center">{track.valence}</TableCell>
				<TableCell className="text-center">{track.energy}</TableCell>
				<TableCell className="text-center">
					{track.danceability}
				</TableCell>
				<TableCell className="text-center">{track.mode}</TableCell>
				<TableCell className="text-center">{track.key}</TableCell>
				<TableCell className="text-right">
					{formatDate(track.dateAdded)}
				</TableCell>
			</TableRow>
		));
		return trackComp;
	}

	function createTableHeader() {
		const TABLE_HEADER = [
			{ headerName: 'Select', sortName: null },
			{ headerName: 'Song Name', sortName: 'name' },
			{ headerName: 'Artists', sortName: 'artists' },
			{ headerName: 'Tempo', sortName: 'tempo' },
			{ headerName: 'Valence', sortName: 'valence' },
			{ headerName: 'Energy', sortName: 'energy' },
			{ headerName: 'Danceability', sortName: 'danceability' },
			{ headerName: 'Mode', sortName: 'mode' },
			{ headerName: 'Key', sortName: 'key' },
			{ headerName: 'Date Added', sortName: 'dateAdded' }
		];

		return (
			<TableRow>
				{TABLE_HEADER.map((header) => (
					<TableHead key={header.sortName} className="text-center">
						<Button
							variant="ghost"
							onClick={() =>
								header.sortName && sortOrder(header.sortName)
							}
						>
							{header.headerName}
						</Button>
					</TableHead>
				))}
			</TableRow>
		);
	}

	function header() {
		return (
			<div className="space-y-4 mb-4">
				{playlist && (
					<Card className="flex-row mt-4">
						<CardContent className="p-8">
							<div>
								<img
									className="rounded-xl"
									key={playlist.id}
									id={playlist.id}
									height={150}
									src={playlist.image}
									alt={playlist.name}
								/>
							</div>
							<div className="flex-1 text-left">
								<div className="ml-8 space-y-8 py-4">
									<CardTitle className="text-4xl">
										{playlist
											? playlist.name
											: 'No Playlist'}
									</CardTitle>
									<p className="text-lg">
										{tracks ? tracks.length : '0'} songs
									</p>
									<p className="text-lg">
										Playlist by: {playlist.owner.name}
									</p>
									<p className="text-lg">
										Duration:{' '}
										{formatDuration(playlist.duration)}
									</p>
									<p className="text-lg">
										{playlist.public
											? '🌐 Public'
											: '🔒 Private'}
									</p>
								</div>
							</div>
							<div className="flex flex-col space-y-8 items-center justify-center">
								<Button className="mx-2">
									Create New Playlist
								</Button>
								<Button className="mx-2">Export to CSV</Button>
							</div>
						</CardContent>
					</Card>
				)}
				<h2 className="text-5xl font-black"></h2>
				<p className="text-2xl"></p>
			</div>
		);
	}

	return (
		<div className="flex-col">
			{header()}
			<div>
				<Card className="py-6 px-4">
					<CardContent>
						<Table>
							<TableHeader>{createTableHeader()}</TableHeader>
							<TableBody>
								{tracks ? displayTracks() : ''}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Playlist;
