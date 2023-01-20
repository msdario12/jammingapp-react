import "./App.css";
import React from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResult } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";
import Spotify from "../../util/Spotify_copy";
import {SpotifyPlayer} from "../SpotifyPlayer/SpotifyPlayer"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: [],
      urlPreviewSong: ''
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({
      playlistTracks: tracks,
    });
  }
  removeTrack(track) {
    let newArray = this.state.playlistTracks.filter(
      (oldTrack) => track !== oldTrack
    );
    this.setState({ playlistTracks: newArray });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: [],
      });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then((searchResult) => {
      this.setState({ searchResults: searchResult });
    });
  }

  playSong(urlPreview) {
    this.setState({urlPreviewSong : urlPreview});
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <SpotifyPlayer src={this.state.urlPreviewSong}/>
          <div className="App-playlist">
            <SearchResult
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              onPlay={this.playSong}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          <div className="SpotifyPlayer">
            <h3>This is a Spotify Player</h3>
            
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
