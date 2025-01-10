function formatPlaylistDuration(ms: number) {
	const millisecondsInMinute = 60 * 1000;
	const millisecondsInHour = 60 * millisecondsInMinute;

	const hours = Math.floor(ms / millisecondsInHour);
	ms %= millisecondsInHour;

	const minutes = Math.floor(ms / millisecondsInMinute);

	return `${hours} hr ${minutes} min`;
}

export { formatPlaylistDuration };
