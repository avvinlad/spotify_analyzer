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
	formatPlaylistDuration,
	formatMilliseconds
} from '../helpers/trackHelper';
import Axios from 'axios';
import Playlist from '@/interfaces/Playlist';
import Track from '@/interfaces/Track';
import Artist from '@/interfaces/Artist';

const PlaylistView: FC = () => {
	const { playlistID } = useParams();
	const [tracks, setTracks] = useState<Track[]>([]);
	const [playlist, setPlaylist] = useState<Playlist>();
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
					const playlist: Playlist = {
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

	function removeDuplicateTracks(tracks: any) {
		const map = new Map();
		tracks.forEach((track: any) => map.set(track.id, track));

		setTracks(Array.from(map.values()));
	}

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
			duration: formatMilliseconds(track.track.duration_ms)
		}));
		removeDuplicateTracks(shapedTracks);
		// audioFeatures(shapedTracks);
	}

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
				<TableCell className="text-center">{track.duration}</TableCell>
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
			{ headerName: 'Duration', sortName: 'duration' },
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
										Duration:{' '}
										{formatPlaylistDuration(
											playlist.duration
										)}
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

export default PlaylistView;
