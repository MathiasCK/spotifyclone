const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:3000",
      clientId: "2dfe1e156f964604b72c49c4b74548a7",
      clientSecret: "ca74dd6b39cf477397a39cf3cceeb7bf",
      refreshToken,
    });

    spotifyApi.refreshAccessToken().then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    });
  } catch (error) {
    console.log("Refresh error " + error.message);
    res.status(400);
  }
});

app.post("/login", (req, res) => {
  try {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:3000",
      clientId: "2dfe1e156f964604b72c49c4b74548a7",
      clientSecret: "ca74dd6b39cf477397a39cf3cceeb7bf",
    });

    spotifyApi.authorizationCodeGrant(code).then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    });
  } catch (error) {
    console.log("Login error " + error.message);
    res.sendStatus(400);
  }
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No lyrics found";
  res.json({ lyrics });
});

app.listen(3001);
