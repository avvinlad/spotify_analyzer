import { useEffect, useState, FC } from 'react'
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/App.css";
import useAuth from '../useAuth';
import Axios from 'axios';

type Code = {
    code: string;
}

const Dashboard: FC<Code> = ({ code }) => {
  let accessToken = useAuth(code);
  const [playlists, setPlaylists] = useState([]);
  const plNames: any = [];

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

  if (playlists.length > 0) {
    playlists.forEach((playlist: any) => {
      plNames.push(
        <div key={playlist.id} className='d-inline-flex flex-column' style={{ padding: "10px" }}>
          <a className='' key={playlist.id} id={playlist.id} href={`/playlist/${playlist.id}`} style={{ margin: "10px" }}>
            <img key={playlist.id} id={playlist.id} src={playlist.images[0].url} alt="album artwork" style={{ maxHeight: "175px", maxWidth: "175px" }}/>
          </a>
          <div className='text-center text-decoration-none text-wrap'>
            <p className='text-light'>{playlist.name}</p>
          </div>
        </div>
      );
    });
  }
  
  return (
    <Container>
      <div className='text-center'>
        <h1 className='text-success'>Playlist Dashboard</h1>
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


