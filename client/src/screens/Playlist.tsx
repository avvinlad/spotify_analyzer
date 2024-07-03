import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	sortTracksAscending,
	sortTracksDescending,
	formatArtists
} from '../helpers/trackHelper';
import Axios from 'axios';

interface PlaylistObj {
	id: string;
	name: string;
	description: string;
	uri: string;
	total: number;
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
	let { playlistID } = useParams();
	const [tracks, setTracks] = useState<Track[]>([]);
	const [playlist, setPlaylist] = useState<PlaylistObj>();
	const [sortTracksOrder, setSortTracksOrder] = useState(0);
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
						total: res.data.tracks.total
					};
					setPlaylist(playlist);
				})
				.catch(() => {
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
			let found = selectedTracks.findIndex(
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
			let tracks = rawTracks.map((track) => track.id);
			let offsets = Math.floor(tracks.length / 100) + 1;
			let promises = [];
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
		let res = await Axios.get('http://localhost:3001/getTrackFeatures', {
			params: { accessToken, tracksID }
		});
		if (res.status !== 200) {
			return null;
		}
		return res.data;
	}

	// add audio features to state
	function addAudioFeatures(shapedTracks: Track[], audioFeatures: any) {
		let updatedTracks: Track[] = shapedTracks;
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
		let sortedTracks: any;
		if (sortTracksOrder === 0)
			sortedTracks = sortTracksDescending(tracks, filter);
		else sortedTracks = sortTracksAscending(tracks, filter);
		setTracks(sortedTracks);
		setSortTracksOrder((sortTracksOrder + 1) % 2);
	}

	function formatDate(date: string) {
		let datetime: Date = new Date(date);
		return datetime.toLocaleDateString();
	}

	// DISPLAY TRACKS
	function displayTracks() {
		if (!tracks) return '';
		let trackComp: any = [];
		trackComp = tracks.map((track: any) => (
			<tr key={track.id} style={{ padding: '10px' }}>
				<td style={{ textAlign: 'center' }}>
					<input
						className="inputButton"
						id={track.id}
						name={track.id}
						type="checkbox"
						value={track.selected}
						onChange={() => handleChange(track)}
					/>
				</td>
				<td style={{ padding: '5px', minWidth: '30px' }}>
					{track.name}
				</td>
				<td style={{ padding: '5px' }}>
					{track.artists
						.map((artist: Artist) => artist.name)
						.join(', ')}
				</td>
				<td>{track.tempo}</td>
				<td>{track.valence}</td>
				<td>{track.energy}</td>
				<td>{track.danceability}</td>
				<td>{track.mode}</td>
				<td>{track.key}</td>
				<td style={{ textAlign: 'center' }}>
					{formatDate(track.dateAdded)}
				</td>
			</tr>
		));
		return trackComp;
	}

	return (
		<div>
			<div>
				<h2>{playlist ? playlist.name : 'No Playlist'}</h2>
				<p>Total Tracks: {tracks ? tracks.length : '0'}</p>
			</div>
			<div>
				<table>
					<thead>
						<tr>
							<th style={{ textDecoration: 'none' }}>Select</th>
							<th>
								<button onClick={() => sortOrder('name')}>
									Song Name⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('artists')}>
									Artists⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('tempo')}>
									Tempo⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('valence')}>
									Valence⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('energy')}>
									Energy⇵
								</button>
							</th>
							<th>
								<button
									onClick={() => sortOrder('danceability')}
								>
									Dance⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('mode')}>
									Mode⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('key')}>
									Key⇵
								</button>
							</th>
							<th>
								<button onClick={() => sortOrder('dateAdded')}>
									Date Added⇵
								</button>
							</th>
						</tr>
					</thead>
					<tbody>{tracks ? displayTracks() : ''}</tbody>
				</table>
			</div>
		</div>
	);
};

export default Playlist;
