import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const CLIENT_ID = 'be00f3272ed442c8b795bbba604b62a4';
const REDIRECT_URI = 'http://localhost:3000';
const SCOPES = [
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private'
];

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
	'%20'
)}`;

export default function Login() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="absolute top-48 text-center space-y-6">
				<h1 className="text-6xl">Sortify</h1>
				<h2 className="text-3xl">Keep your playlists organized!</h2>
			</div>
			<div className="flex flex-col justify-center items-center w-full space-y-12">
				<div className="flex p-4 rounded-lg">
					<Tabs defaultValue="introduction">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="introduction">
								Introduction
							</TabsTrigger>
							<TabsTrigger value="features">Features</TabsTrigger>
							<TabsTrigger value="spotify_api_changes">
								Spotify API Changes
							</TabsTrigger>
						</TabsList>
						<TabsContent value="introduction">
							<Card>
								<CardContent className="flex justify-normal p-4 px-4">
									Ever have a playlist with way too many
									songs? After using my playlists
									<br /> for more than 5 years and constantly
									adding songs, it lost its intended feel.
									<br /> This is where Sortify helps fix this
									problem!
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="features">
							<Card>
								<CardContent className="flex justify-normal p-2 px-4">
									<ul className="list-disc list-inside">
										<li>
											Create new playlist with the
											selected songs
										</li>
										<li>
											Delete songs from a playlist with
											the selected songs
										</li>
										<li>Export playlist to csv</li>
										<li>
											View audio features such as tempo,
											bpm, and key (DEPRACATED)
										</li>
										<li>
											Select songs and receive a list of
											alike songs (DEPRACATED)
										</li>
									</ul>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="spotify_api_changes">
							<Card>
								<CardContent className="flex justify-normal p-2 px-4">
									After Novemeber 2024 Spotify chose to remove
									certain <br />
									API endpoint which this application used
									such as the
									<br /> Audio Analysis, Audio Features, and
									Get Recommendations.
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
				<Button size="lg" className="bg-green-600">
					<a href={AUTH_URL} className="font-semibold text-center">
						LOGIN WITH SPOTIFY
					</a>
					<LogIn className="ml-2" />
				</Button>
			</div>
		</div>
	);
}
