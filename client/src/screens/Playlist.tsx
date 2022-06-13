import React, { FC, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import Axios from "axios";

interface PlaylistObj {
  id: string;
  name: string;
  description: string;
  uri: string;
  total: number;
};

interface Track {
  id: string;
  name: string;
  artists: string;
  tempo: number;
  acousticness: number;
  valence: number;
  energy: number;
};

interface Artist {
  id: string; 
  name: string;
}

const Playlist: FC = () => {
  let { playlistID } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<PlaylistObj>();
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken && playlistID) {
      Axios.get("http://localhost:3001/getPlaylistInfo", { params: { accessToken, playlistID }})
      .then((res) => {
        const pl: PlaylistObj = {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          uri: res.data.uri,
          total: res.data.tracks.total
        };
        setPlaylist(pl);
      })
      .catch(() => {
        window.location.href = "/";
      });
    }
  }, [accessToken, playlistID]);
  
  
  useEffect(() => {
    if (playlist && tracks && tracks.length < playlist.total) {
      const totalTracks = playlist?.total;
      Axios.get("http://localhost:3001/getPlaylistTracks", { params: { accessToken, playlistID, totalTracks } })
      .then((res) => {
        formatTracks(res.data);
      })
      .catch(() => {
        window.location.href = "/";
      });
    }
  });


  function formatTracks(resTracks: any) {
    let shapedTracks: Track[] = [];
    shapedTracks = resTracks.map((track: any) => ( {
      id: track.track.id,
      name: track.track.name,
      artists: _formatArtists(track.track.artists)
    }));
    setTracks(shapedTracks);
  }

  function _formatArtists(artists: any) {
    return (artists.map((artist: any) : Artist => ({
        id: artist.id,
        name: artist.name
      }))
    )
  }

  function retrieveAudioFeatures() {
    if (playlist) {
      let tracksID = tracks.map((track: any) => (track.id)).join(","); 
      console.log(tracks);
      Axios.get("http://localhost:3001/getTrackFeatures", { params: { accessToken, tracksID } })
      .then((res: any) => {
        addAudioFeatures(res.data);
      })
      .catch((err) => {
        console.log(err);
        // window.location.href = "/";
      });
    }
  }

  function addAudioFeatures(audioFeatures: any) {
    let updatedTracks: Track[] = tracks;
    audioFeatures.forEach((audioFeature: any) => {
      updatedTracks.find((track: Track)=> track.id === audioFeature.id)!.tempo = audioFeature.tempo;
      updatedTracks.find((track: Track)=> track.id === audioFeature.id)!.acousticness = audioFeature.acousticness;
      updatedTracks.find((track: Track)=> track.id === audioFeature.id)!.valence = audioFeature.valence;
      updatedTracks.find((track: Track)=> track.id === audioFeature.id)!.energy = audioFeature.energy;
    });
    setTracks(updatedTracks);
    console.log(tracks);
  }

  // DISPLAY TRACKS
  function displayTracks() {
    if (!tracks) return '';
    let trackComp: any = [];
    trackComp = tracks.map((track: any) => (
      <tr key={track.id} style={ {padding: "10px"} }>
        <td style={{ padding: "10px" }}>{track.name}</td>
        <td style={{ padding: "10px" }}>{track.artists.map((artist: Artist) => artist.name).join(", ")}</td>
        <td style={{ padding: "10px" }}>{track.tempo}</td>
      </tr>
    ));
    return trackComp;
  }

  return (  
    <Container>
      <div className="text-center">
        <h2>{playlist ? playlist.name : "No Playlist"}</h2>
        <p>Total Tracks: {tracks ? tracks.length : "0"}</p>
      </div>
      <div className="d-flex justify-content-center">
        <table className="table table-bordered table-hover" style={{ border: "#1DB954" }}>
          <thead>
            <tr>
              <th>Song Name</th>
              <th>Artists</th>
              <th>Beats Per Minute (BPM)</th>
            </tr>
          </thead>
          <tbody className="" style={{ margin: "10px" }}>
            { tracks ? displayTracks() : '' }
          </tbody>
          </table>
      </div>
    </Container>
  );
};

export default Playlist;