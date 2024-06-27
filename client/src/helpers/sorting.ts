function sortTracksAscending(tracks: any, filter: string) {
    const sortedTracks = JSON.parse(JSON.stringify(tracks));
    if (filter === "artists") {
        console.log(`artists: ${tracks.artists}`);
        sortedTracks.sort((a: any, b: any) => {
            var filterA = a.artists.join(", ").toUpperCase(); // convert to uppercase for case-insensitive sorting
            var filterB = b.artists.join(", ").toUpperCase(); // convert to uppercase for case-insensitive sorting
            // ascending order
            if (filterA > filterB) return -1;
            if (filterA < filterB) return 1;
            return 0;
        });
    } else {
        sortedTracks.sort((a: any, b: any) => {
            var filterA =
                typeof a[filter][0] === "string"
                    ? a[filter].toUpperCase()
                    : a[filter]; // convert to uppercase for case-insensitive sorting
            var filterB =
                typeof b[filter][0] === "string"
                    ? b[filter].toUpperCase()
                    : b[filter]; // convert to uppercase for case-insensitive sorting
            // ascending order
            if (filterA > filterB) return -1;
            if (filterA < filterB) return 1;
            return 0;
        });
    }
    return sortedTracks;
}

function sortTracksDescending(tracks: any, filter: string) {
    const sortedTracks = JSON.parse(JSON.stringify(tracks));
    if (filter === "artists") {
        console.log(`artists: ${tracks.artists}`);
        sortedTracks.sort((a: any, b: any) => {
            var filterA = a.artists.join(", ").toUpperCase(); // convert to uppercase for case-insensitive sorting
            var filterB = b.artists.join(", ").toUpperCase(); // convert to uppercase for case-insensitive sorting
            // ascending order
            if (filterA < filterB) return -1;
            if (filterA > filterB) return 1;
            return 0;
        });
    } else {
        sortedTracks.sort((a: any, b: any) => {
            var filterA =
                typeof a[filter][0] === "string"
                    ? a[filter].toUpperCase()
                    : a[filter]; // convert to uppercase for case-insensitive sorting
            var filterB =
                typeof b[filter][0] === "string"
                    ? b[filter].toUpperCase()
                    : b[filter]; // convert to uppercase for case-insensitive sorting
            // descending order
            if (filterA < filterB) return -1;
            if (filterA > filterB) return 1;
            return 0;
        });
        return sortedTracks;
    }
}

export { sortTracksAscending, sortTracksDescending };
