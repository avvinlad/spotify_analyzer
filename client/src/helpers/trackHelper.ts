function formatArtists(artists: any) {
	return artists.map((artist: any): any => ({
		id: artist.id,
		name: artist.name
	}));
}

function sortTracksAscending(tracks: any, filter: string) {
	let sortedTracks = JSON.parse(JSON.stringify(tracks));
	if (filter === 'artists') {
		sortedTracks.forEach((track: any, index: number) => {
			const sortedArtists = _sortArtistsAscending(track.artists);
			sortedTracks[index].artists = sortedArtists;
		});
		sortedTracks.sort((a: any, b: any) => {
			var filterA = a.artists[0].name.toUpperCase();
			var filterB = b.artists[0].name.toUpperCase();

			if (filterA > filterB) return -1;
			if (filterA < filterB) return 1;
			return 0;
		});
	} else {
		sortedTracks = _sortByFilter(sortedTracks, filter, true);
	}
	return sortedTracks;
}

function sortTracksDescending(tracks: any, filter: string) {
	let sortedTracks = JSON.parse(JSON.stringify(tracks));
	if (filter === 'artists') {
		sortedTracks.forEach((track: any, index: number) => {
			const sortedArtists = _sortArtistsDescending(track.artists);
			sortedTracks[index].artists = sortedArtists;
		});
		sortedTracks.sort((a: any, b: any) => {
			var filterA = a.artists[0].name.toUpperCase();
			var filterB = b.artists[0].name.toUpperCase();

			if (filterA < filterB) return -1;
			if (filterA > filterB) return 1;
			return 0;
		});
	} else {
		sortedTracks = _sortByFilter(sortedTracks, filter);
	}
	return sortedTracks;
}

// SORT ARTISTS - ASCENDING
function _sortArtistsAscending(artists: any) {
	const sortedArtists = JSON.parse(JSON.stringify(artists));
	sortedArtists.sort((a: any, b: any) => {
		var filterA = a.name.toUpperCase();
		var filterB = b.name.toUpperCase();

		return _filterAscending(filterA, filterB);
	});

	return sortedArtists;
}

// SORT ARTISTS - DESCENDING
function _sortArtistsDescending(artists: any) {
	const sortedArtists = JSON.parse(JSON.stringify(artists));
	sortedArtists.sort((a: any, b: any) => {
		var filterA = a.name.toUpperCase();
		var filterB = b.name.toUpperCase();

		return _filterDescending(filterA, filterB);
	});

	return sortedArtists;
}

function _sortByFilter(elements: any, filter: string, ascending = false) {
	const sortedElements = JSON.parse(JSON.stringify(elements));

	sortedElements.sort((a: any, b: any) => {
		var filterA =
			typeof a[filter][0] === 'string'
				? a[filter].toUpperCase()
				: a[filter];
		var filterB =
			typeof b[filter][0] === 'string'
				? b[filter].toUpperCase()
				: b[filter];

		if (!ascending) {
			return _filterDescending(filterA, filterB);
		}

		return _filterAscending(filterA, filterB);
	});

	return sortedElements;
}

function _filterAscending(a: any, b: any) {
	if (a > b) return -1;
	if (a < b) return 1;
	return 0;
}

function _filterDescending(a: any, b: any) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

export { sortTracksAscending, sortTracksDescending, formatArtists };
