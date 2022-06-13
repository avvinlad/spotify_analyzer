import { useEffect, useState, FC } from 'react'
import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import useAuth from '../useAuth';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import React from 'react'

// interface Playlist {
//     id: string,
//     playlistName: string;
// };

type Code = {
    code: string;
}

const Dashboard: FC<Code> = ({ code }) => {
  let accessToken = useAuth(code);
  const [playlists, setPlaylists] = useState([]);
  const plNames: any = [];
  let navigate = useNavigate();

  if (!accessToken) {
    accessToken = sessionStorage.getItem('accessToken') ?? '';
  }

  useEffect(() => {
    if (accessToken) {
      Axios.get("http://localhost:3001/getPlaylists", { params: { accessToken: accessToken }})
      .then(res => {
        setPlaylists(res.data.items);
      })
      .catch(() => {
        window.location.href = "/";
      });
    }
  }, [accessToken]);
  
  function handlePlaylist(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let playlistID = (e.target as HTMLButtonElement).id; 
    
    if (!playlistID) return;
    navigate(`/playlist/${playlistID}`);
  }

  if (playlists.length > 0) {
    playlists.forEach((playlist: any) => {
      plNames.push(
        <Button key={playlist.id} id={playlist.id} onClick={(e) => handlePlaylist(e)} className="btn btn-success btn-md" style={{ "textAlign": "center", "margin": "5px" }}>{playlist.name}</Button>
      );
    });
  }
  
  return (
    <Container>
      <div className='text-center'>
        <h1>Spotify Dashboard</h1>
        <h2>Choose Your Playlist:</h2>
      </div>
      <div className='d-flex justify-content-center'>
        <div className='d-inline-flex flex-column align-items-center'>
          {playlists ? plNames : 'No Playlists'}
        </div>
      </div>
    </Container>
  )
}

export default Dashboard;


