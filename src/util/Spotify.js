const clientID = "37e04e7dc75246b1a36655476b5a7b15";
const redirectUri = "http://localhost:3000/";
let accesToken = "";
const Spotify = {
  getAccessToken() {
    if (accesToken.length) {
      return accesToken;
    }
    // check for acces token match
    const accesTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accesTokenMatch && expiresInMatch) {
      accesToken = accesTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => (accesToken = ""), expiresIn * 1000);
      window.history.pushState("Acces Token", null, "/");
      return accesToken;
    } else {
      const accesUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accesUrl;
    }
  },

  async search(searchTerm) {
    const accesToken = Spotify.getAccessToken();
    let header = {
      headers: { Authorization: `Bearer ${accesToken}` },
    };
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      header
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        console.log(jsonResponse);
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accesToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${accesToken}` };
    let userID;

    return fetch("https://api.spotify.com/v1/me", { headers: header })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: header,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
              {
                headers: header,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      });
  },
};

export default Spotify;
