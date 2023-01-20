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
    let urlEndPointSearch = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
    const response = await fetch(urlEndPointSearch, header);
    if (response.ok) {
      const jsonResponse = await response.json();
      if (!jsonResponse) {
        return [];
      }
      const arrayResponse = await jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        preview_url: track.preview_url

      }));
      return arrayResponse;
    }
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accesToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${accesToken}` };
    let userID;
    const urlEndPointPlaylist = "https://api.spotify.com/v1/me";
    const response = await fetch(urlEndPointPlaylist, { headers: header });
    if (response.ok) {
      const jsonResponse = await response.json();
      userID = jsonResponse.id;
      const objectFetch = {
        headers: header,
        method: "POST",
        body: JSON.stringify({ name: name }),
      };
      const response2 = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        objectFetch
      );
      if (response2.ok) {
        const jsonResponse2 = await response2.json();
        const playlistId = jsonResponse2.id;
        const headerRequestPlaylist = {
          headers: header,
          method: "POST",
          body: JSON.stringify({ uris: trackUris }),
        };
        const requestSavePlaylist = await fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
          headerRequestPlaylist
        );

        return requestSavePlaylist;
      }
    }
  },

};

export default Spotify;
