const express = require('express');
const cors = require('cors');
const request = require('request');
const Axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const CREDS = {
  "clientId": process.env.CLIENT_ID,
  "clientSecret": process.env.CLIENT_SECRET,
  "redirectUri": "http://localhost:3000"
}

// LOGIN REQUEST
app.post('/login', function(req: any, res: any) {
  let code = req.body.code;

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: CREDS.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(CREDS.clientId + ':' + CREDS.clientSecret).toString('base64'))
    },
    json: true
  };
  
  request.post(authOptions, function(error: any, response: any, body: any) {
    if (!error && response.statusCode === 200) {
      res.send({
        'access_token': body.access_token,
        'refresh_token': body.refresh_token,
        'expires_in': body.expires_in
      });
    }
  });
});

// REFRESH REQUEST
app.post('/refresh', (req: any, res: any) => {
  const refreshToken = req.body.refreshToken;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(CREDS.clientId + ':' + CREDS.clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };

  request.post(authOptions, function(error: Error, response: any, body: any) {
    if (!error && response.statusCode === 200) {
      res.send({
        'access_token': body.access_token,
        'refresh_token': body.refresh_token,
        'expires_in': body.expires_in
      });
    }
  });
});

// GET ALL USER PLAYLISTS
app.get('/getPlaylists', (req: any, res: any) => {
  const accessToken = req.query.accessToken;
  let getPlaylists = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }

  request.get(getPlaylists, (error: Error, response: any, body: any) => {
    if (!error && response.statusCode === 200) {
      res.send(body);
    }
  });
});

// GET PLAYLIST INFO
app.get('/getPlaylistInfo', (req: any, res: any) => {
  const accessToken = req.query.accessToken;
  const playlistID = req.query.playlistID; 

  let getPlaylist = {
    url: `https://api.spotify.com/v1/playlists/${playlistID}??fields=name%2Cdescription%2Curi%2Cid%2Ctracks(total)`,
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }

  request.get(getPlaylist, (error: Error, response: any, body: any) => {
    if (!error && response.statusCode === 200) {
      res.send(body);
    }
  });
});

// GET PLAYLIST TRACKS
app.get('/getPlaylistTracks', async (req: any, res: any) => {
  const accessToken = req.query.accessToken;
  const playlistID = req.query.playlistID; 
  const totalTracks = req.query.totalTracks; 

  let numOffsets = Math.floor(totalTracks / 100) + 1;

  let promises = []; 
  for (let offset = 0; offset < numOffsets; offset++) {
    promises.push(getTracks(accessToken, playlistID, offset * 100));
  }
  
  Promise.all(promises)
  .then((response) => {
    let tracks: any = [];
    response.forEach(data => {
      tracks = tracks.concat(data.items);
    });
    res.send(tracks);
  })
});

async function getTracks(accessToken: string, playlistID: string, offset: number) {
  let tracks: any = [];
  let url: any = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?market=CA&offset=${offset}`;
  let config = {
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }

  let res = await Axios.get(url, config);
  if (res.status !== 200) { return null; }
  return res.data;
}


// // GET TRACK FEATURES (TEMPO, ENERGY, DANCEABILITY, ETC...)
app.get('/getTrackFeatures', async (req: any, res: any) => {
  const accessToken = req.query.accessToken;
  const tracksID = req.query.tracksID; 
  
  let url: any = `https://api.spotify.com/v1/audio-features?ids=${tracksID}`;
  let config = {
    headers: { 
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }

  Axios.get(url, config)
  .then((response: any) => {
    res.send(response.data.audio_features);
  })
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server is running...");
});