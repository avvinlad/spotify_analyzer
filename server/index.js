"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
};
// LOGIN REQUEST
app.post('/login', function (req, res) {
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
    request.post(authOptions, function (error, response, body) {
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
app.post('/refresh', (req, res) => {
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
    request.post(authOptions, function (error, response, body) {
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
app.get('/getPlaylists', (req, res) => {
    const accessToken = req.query.accessToken;
    let getPlaylists = {
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    };
    request.get(getPlaylists, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});
// GET PLAYLIST INFO
app.get('/getPlaylistInfo', (req, res) => {
    const accessToken = req.query.accessToken;
    const playlistID = req.query.playlistID;
    let getPlaylist = {
        url: `https://api.spotify.com/v1/playlists/${playlistID}??fields=name%2Cdescription%2Curi%2Cid%2Ctracks(total)`,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    };
    request.get(getPlaylist, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});
// GET PLAYLIST TRACKS
app.get('/getPlaylistTracks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let tracks = [];
        response.forEach(data => {
            tracks = tracks.concat(data.items);
        });
        res.send(tracks);
    });
}));
function getTracks(accessToken, playlistID, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        let tracks = [];
        let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?market=CA&offset=${offset}`;
        let config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        let res = yield Axios.get(url, config);
        if (res.status !== 200) {
            return null;
        }
        return res.data;
    });
}
// // GET TRACK FEATURES (TEMPO, ENERGY, DANCEABILITY, ETC...)
app.get('/getTrackFeatures', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.query.accessToken;
    const tracksID = req.query.tracksID;
    let url = `https://api.spotify.com/v1/audio-features?ids=${tracksID}`;
    let config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    };
    Axios.get(url, config)
        .then((response) => {
        res.send(response.data.audio_features);
    });
}));
const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server is running...");
});
