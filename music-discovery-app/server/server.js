require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Spotify API Credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let accessToken = "";

// Function to get Spotify Access Token
async function getAccessToken() {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({ grant_type: "client_credentials" }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        accessToken = response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
    }
}

// Call the function on server start
getAccessToken();

// Endpoint to search for an artist
app.get("/search", async (req, res) => {
    const { artist } = req.query;
    if (!artist) return res.status(400).json({ error: "Artist name required" });

    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=1`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.data.artists.items.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.json(response.data.artists.items[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching artist data" });
    }
});

// Endpoint to get similar artists
app.get("/recommendations", async (req, res) => {
    const { artistId } = req.query;
    if (!artistId) return res.status(400).json({ error: "Artist ID required" });

    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        res.json(response.data.artists);
    } catch (error) {
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
