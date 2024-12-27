interface Track {
	id: string;
	name: string;
	artists: object[];
	dateAdded: string;
	duration: number;
	tempo?: number;
	acoustics?: number;
	valence?: number;
	energy?: number;
	danceability?: number;
	mode?: number;
	key?: number;
	selected?: boolean;
}

export default Track;
