var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var cors = require('cors');
var request = require('request');
var Axios = require('axios');
require('dotenv').config();
var app = express();
app.use(express.json());
app.use(cors());
var CREDS = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000'
};
// LOGIN REQUEST
app.post('/login', function (req, res) {
    var code = req.body.code;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: CREDS.redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            Authorization: 'Basic ' +
                Buffer.from(CREDS.clientId + ':' + CREDS.clientSecret).toString('base64')
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send({
                access_token: body.access_token,
                refresh_token: body.refresh_token,
                expires_in: body.expires_in
            });
        }
    });
});
// REFRESH REQUEST
app.post('/refresh', function (req, res) {
    var refreshToken = req.body.refreshToken;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: 'Basic ' +
                Buffer.from(CREDS.clientId + ':' + CREDS.clientSecret).toString('base64')
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send({
                access_token: body.access_token,
                refresh_token: body.refresh_token,
                expires_in: body.expires_in
            });
        }
    });
});
// GET ALL USER PLAYLISTS
app.get('/getPlaylists', function (req, res) {
    var accessToken = req.query.accessToken;
    var getPlaylists = {
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            Accept: 'application/json',
            Authorization: "Bearer ".concat(accessToken)
        }
    };
    request.get(getPlaylists, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});
// GET PLAYLIST INFO
app.get('/getPlaylistInfo', function (req, res) {
    var accessToken = req.query.accessToken;
    var playlistID = req.query.playlistID;
    var getPlaylist = {
        url: "https://api.spotify.com/v1/playlists/".concat(playlistID, "??fields=name%2Cdescription%2Curi%2Cid%2Ctracks(total)"),
        headers: {
            Accept: 'application/json',
            Authorization: "Bearer ".concat(accessToken)
        }
    };
    request.get(getPlaylist, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});
// GET PLAYLIST TRACKS
app.get('/getPlaylistTracks', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var accessToken, playlistID, totalTracks, numOffsets, promises, offset;
    return __generator(this, function (_a) {
        accessToken = req.query.accessToken;
        playlistID = req.query.playlistID;
        totalTracks = req.query.totalTracks;
        numOffsets = Math.floor(totalTracks / 100) + 1;
        promises = [];
        for (offset = 0; offset < numOffsets; offset++) {
            promises.push(getTracks(accessToken, playlistID, offset * 100));
        }
        Promise.all(promises).then(function (response) {
            var tracks = [];
            response.forEach(function (data) {
                tracks = tracks.concat(data.items);
            });
            res.send(tracks);
        });
        return [2 /*return*/];
    });
}); });
function getTracks(accessToken, playlistID, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var tracks, url, config, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tracks = [];
                    url = "https://api.spotify.com/v1/playlists/".concat(playlistID, "/tracks?market=CA&offset=").concat(offset);
                    config = {
                        headers: {
                            Accept: 'application/json',
                            Authorization: "Bearer ".concat(accessToken)
                        }
                    };
                    return [4 /*yield*/, Axios.get(url, config)];
                case 1:
                    res = _a.sent();
                    if (res.status !== 200) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, res.data];
            }
        });
    });
}
// // GET TRACK FEATURES (TEMPO, ENERGY, DANCEABILITY, ETC...)
app.get('/getTrackFeatures', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var accessToken, tracksID, url, config;
    return __generator(this, function (_a) {
        accessToken = req.query.accessToken;
        tracksID = req.query.tracksID;
        url = "https://api.spotify.com/v1/audio-features?ids=".concat(tracksID);
        config = {
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer ".concat(accessToken)
            }
        };
        Axios.get(url, config).then(function (response) {
            res.send(response.data.audio_features);
        });
        return [2 /*return*/];
    });
}); });
// GET ARTIST INFORMATION
app.get('/artists', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var accessToken, artistsID, url, config;
    return __generator(this, function (_a) {
        accessToken = req.query.accessToken;
        artistsID = req.query.artistsID;
        url = "https://api.spotify.com/v1/artists?ids=".concat(artistsID);
        config = {
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer ".concat(accessToken)
            }
        };
        Axios.get(url, config).then(function (response) {
            res.send(response.data.artists);
        });
        return [2 /*return*/];
    });
}); });
// CREATES A NEW PLAYLIST
app.post('/createPlaylist', function (req, res) {
    var accessToken = req.body.accessToken;
    var userID = req.body.userID;
    var playlistName = req.body.playlistName;
    var playlistDesc = req.body.playlistDesc;
    console.log("User ID: ".concat(userID, " --- Playlist Name: ").concat(playlistName, " --- Playlist Desc: ").concat(playlistDesc));
    var url = "\thttps://api.spotify.com/v1/users/".concat(userID, "/playlists");
    var config = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: "Bearer ".concat(accessToken)
        },
        name: playlistName,
        description: playlistDesc,
        public: false
    };
    Axios.post(url, config)
        .then(function (response) {
        console.log(response.statusCode);
    })["catch"](function (error) {
        console.log(error.response.status);
    });
});
var PORT = 3001;
app.listen(PORT, function () {
    console.log('Server is running...');
});
