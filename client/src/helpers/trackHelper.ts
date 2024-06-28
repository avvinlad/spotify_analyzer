function sortTracksAscending(tracks: any, filter: string) {
	let sortedTracks = JSON.parse(JSON.stringify(tracks));
	if (filter === 'artists') {
		sortedTracks.forEach((track: any, index: number) => {
			const sortedArtists = _sortArtistsAscending(track.artists);
			sortedTracks[index].artists = sortedArtists;
		});
		sortedTracks.sort((a: any, b: any) => {
			var filterA = a.artists[0].name.toUpperCase(); // convert to uppercase for case-insensitive sorting
			var filterB = b.artists[0].name.toUpperCase(); // convert to uppercase for case-insensitive sorting
			// ascending order
			if (filterA > filterB) return -1;
			if (filterA < filterB) return 1;
			return 0;
		});
	} else {
		sortedTracks = _sortByFilter(sortedTracks, filter);
	}
	return sortedTracks;
}

function sortTracksDescending(tracks: any, filter: string) {
	console.log(`it hit this?`); // this was hit
	let sortedTracks = JSON.parse(JSON.stringify(tracks));
	if (filter === 'artists') {
		sortedTracks.forEach((track: any, index: number) => {
			const sortedArtists = _sortArtistsDescending(track.artists);
			sortedTracks[index].artists = sortedArtists;
		});
		sortedTracks.sort((a: any, b: any) => {
			var filterA = a.artists[0].name.toUpperCase(); // convert to uppercase for case-insensitive sorting
			var filterB = b.artists[0].name.toUpperCase(); // convert to uppercase for case-insensitive sorting
			// ascending order
			if (filterA < filterB) return -1;
			if (filterA > filterB) return 1;
			return 0;
		});
	} else {
		sortedTracks = _sortByFilter(sortedTracks, filter, false);
	}
	return sortedTracks;
}

function _sortArtistsAscending(artists: any) {
	const sortedArtists = JSON.parse(JSON.stringify(artists));
	sortedArtists.sort((a: any, b: any) => {
		var filterA = a.name.toUpperCase(); // convert to uppercase for case-insensitive sorting
		var filterB = b.name.toUpperCase(); // convert to uppercase for case-insensitive sorting
		// ascending order
		if (filterA < filterB) return -1;
		if (filterA > filterB) return 1;
		return 0;
	});

	return sortedArtists;
}

function _sortArtistsDescending(artists: any) {
	const sortedArtists = JSON.parse(JSON.stringify(artists));
	sortedArtists.sort((a: any, b: any) => {
		var filterA = a.name.toUpperCase(); // convert to uppercase for case-insensitive sorting
		var filterB = b.name.toUpperCase(); // convert to uppercase for case-insensitive sorting
		// ascending order
		if (filterA > filterB) return -1;
		if (filterA < filterB) return 1;
		return 0;
	});

	return sortedArtists;
}

function _sortByFilter(elements: any, filter: string, ascending = true) {
	const sortedElements = JSON.parse(JSON.stringify(elements));

	sortedElements.sort((a: any, b: any) => {
		var filterA =
			typeof a[filter][0] === 'string'
				? a[filter].toUpperCase()
				: a[filter]; // convert to uppercase for case-insensitive sorting
		var filterB =
			typeof b[filter][0] === 'string'
				? b[filter].toUpperCase()
				: b[filter]; // convert to uppercase for case-insensitive sorting

		if (ascending) {
			if (filterA > filterB) return -1;
			if (filterA < filterB) return 1;
		} else if (!ascending) {
			if (filterA < filterB) return -1;
			if (filterA > filterB) return 1;
		}
		return 0;
	});

	return sortedElements;
}

export { sortTracksAscending, sortTracksDescending };
