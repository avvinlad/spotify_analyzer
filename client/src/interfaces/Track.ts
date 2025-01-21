interface Track {
	id: string;
	name: string;
	artists: object[];
	dateAdded: string;
	duration: number;
	popularity: number;
	selected?: boolean;
	// THESE HAS SINCE BEEN REMOVED FROM THE
	// SPOTIFY API AFTER CHANGES IN NOVEMBER 2024
	// tempo?: number;
	// acoustics?: number;
	// valence?: number;
	// energy?: number;
	// danceability?: number;
	// mode?: number;
	// key?: number;
}

export default Track;
