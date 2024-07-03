import React from 'react';

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
		<div>
			<a href={AUTH_URL}>LOGIN WITH SPOTIFY</a>
		</div>
	);
}
