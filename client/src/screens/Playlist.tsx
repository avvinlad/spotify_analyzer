import React, { FC, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
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
    shapedTracks = resTracks.map((track: any) => ({
      id: track.track.id,
      name: track.track.name,
      artists: _formatArtists(track.track.artists),
      tempo: 0,
      acousticness: 0,
      valence: 0,
      energy: 0
    }));
    // setTracks(shapedTracks);
    audioFeatures(shapedTracks);
  }

  function _formatArtists(artists: any) {
    return (artists.map((artist: any) : Artist => ({
        id: artist.id,
        name: artist.name
      }))
    )
  }


  async function audioFeatures(rawTracks: Track[]) {
    if (playlist) {
      let tracks = rawTracks.map(track => track.id)
      let offsets = Math.floor(tracks.length / 100) + 1;
      let promises = [];
      let curTracks: string = '';
      for (let chunk = 0; chunk < offsets; chunk++) {
        curTracks = tracks.slice(chunk * 100, (chunk + 1) * 100).join(",");
        promises.push(getAudioFeatures(curTracks));
      }

      Promise.all(promises)
      .then((response) => {
        let audioFeatures: any = [];
        response.forEach(audioFeature => {
          audioFeatures = audioFeatures.concat(audioFeature);
        });
        addAudioFeatures(rawTracks, audioFeatures);
      });
    }
  }

  async function getAudioFeatures(tracksID: string) {
    let res = await Axios.get("http://localhost:3001/getTrackFeatures", { params: { accessToken, tracksID } })
    if (res.status !== 200) { return null; }
    return res.data;
  }


  function addAudioFeatures(shapedTracks: Track[], audioFeatures: any) {
    let updatedTracks: Track[] = shapedTracks;
    if (!tracks && !audioFeatures) { return null; }
    // console.log(`${updatedTracks.length} === ${audioFeatures.length}`);
    if (updatedTracks.length !== audioFeatures.length) { return null; }
    updatedTracks.forEach(track => {
      audioFeatures.forEach((feature: any) => {
        if (track.id === feature.id) {
          track.tempo = feature.tempo;
          track.acousticness = feature.acousticness;
          track.energy = feature.energy;
          track.valence = feature.valence;
        }
      })
    })
    setTracks(updatedTracks);
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
        <td style={{ padding: "10px" }}>{track.valence}</td>
        <td style={{ padding: "10px" }}>{track.energy}</td>
      </tr>
    ));
    return trackComp;
  }

  return (  
    <Container>
      <div className="text-center text-info">
        <h2>{playlist ? playlist.name : "No Playlist"}</h2>
        <p>Total Tracks: {tracks ? tracks.length : "0"}</p>
      </div>
      <div className="d-flex justify-content-center">
        <table className="table text-light">
          <thead className="-center">
            <tr>
              <th>Song Name</th>
              <th>Artists</th>
              <th>Beats Per Minute (BPM)</th>
              <th>Valence</th>
              <th>Energy</th>
            </tr>
          </thead>
          <tbody className="">
            { tracks ? displayTracks() : '' }
          </tbody>
          </table>
      </div>
    </Container>
  );
};

export default Playlist;