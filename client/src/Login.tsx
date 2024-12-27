import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';

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
		<div className="flex h-screen justify-center items-center">
			<Button size="lg" className="bg-green-600">
				<a href={AUTH_URL} className="font-semibold text-center">
					LOGIN WITH SPOTIFY
				</a>
				<LogIn className="ml-2" />
			</Button>
		</div>
	);
}
