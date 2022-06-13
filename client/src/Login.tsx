import React from 'react';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'

const CLIENT_ID = "be00f3272ed442c8b795bbba604b62a4";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = [
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-currently-playing",
];

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join("%20")}`

export default function Login() {
  return (
    <Container>
      <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "100vh" }}>
        <a className="btn btn-success btn-lg" href={AUTH_URL} style={{ background: "#1DB954", border: "none" }}>LOGIN WITH SPOTIFY</a>
      </div>
    </Container>
  )
}