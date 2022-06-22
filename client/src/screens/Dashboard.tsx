import { useEffect, useState, FC } from 'react'
import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/App.css";
import useAuth from '../useAuth';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import React from 'react'

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
        <div className='d-inline-flex flex-column' style={{ padding: "10px" }}>
          <Button className='' key={playlist.id} id={playlist.id} onClick={(e) => handlePlaylist(e)} style={{ margin: "10px" }}>
            <img key={playlist.id} id={playlist.id} src={playlist.images[0].url} alt="album artwork" style={{ maxHeight: "150px", maxWidth: "150px" }}/>
          </Button>
          <div className='text-center text-decoration-none text-wrap'>
            <p className='text-light'>{playlist.name}</p>
          </div>
        </div>
      );
    });


    // playlists.forEach((playlist: any) => {
    //   plNames.push(
    //     <Button key={playlist.id} id={playlist.id} onClick={(e) => handlePlaylist(e)} className="btn btn-success btn-md" style={{ "textAlign": "center", "margin": "5px" }}>{playlist.name}</Button>
    //   );
    // });
  }
  
  return (
    <Container>
      <div className='text-center'>
        <h1 className='text-info'>Dashboard</h1>
      </div>
      <div className='d-flex'>
        <div className='col'>
          {playlists ? plNames : 'No Playlists'}
        </div>
      </div>
    </Container>
  )
}

export default Dashboard;


