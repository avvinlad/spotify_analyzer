import Track from '@/interfaces/Track';

function formatTracks(resTracks: any) {
	let shapedTracks: Track[] = [];
	shapedTracks = resTracks.map((track: any) => ({
		id: track.track.id,
		name: track.track.name,
		artists: _formatArtists(track.track.artists),
		popularity: track.track.popularity,
		dateAdded: track.added_at,
		duration: _formatMilliseconds(track.track.duration_ms)
	}));
	return _removeDuplicateTracks(shapedTracks);
}

function formatDate(date: string) {
	const datetime: Date = new Date(date);
	return datetime.toLocaleDateString();
}

function _formatMilliseconds(milliseconds: number) {
	// const hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 ms
	const minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 ms
	const seconds = Math.floor((milliseconds % 60000) / 1000); // 1 second = 1000 ms

	// Pad with leading zeros if needed
	// const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString();
	const formattedSeconds = seconds.toString().padStart(2, '0');

	return `${formattedMinutes}:${formattedSeconds}`;
}

function _formatArtists(artists: any) {
	return artists.map((artist: any): any => ({
		id: artist.id,
		name: artist.name
	}));
}

function _removeDuplicateTracks(tracks: Track[]) {
	const map = new Map();
	tracks.forEach((track: any) => map.set(track.id, track));

	return Array.from(map.values());
}

export { formatTracks, formatDate };
