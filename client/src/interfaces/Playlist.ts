interface Playlist {
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

export default Playlist;
