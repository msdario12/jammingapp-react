import React from "react";
import "./Track.css";

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  renderAction() {
    
    if (this.props.isRemoval) {
      return (
        <button className="Track-action"
                onClick={this.removeTrack}>-</button>
      )
    } else {
      return (
        <button className="Track-action"
                onClick={this.addTrack}>+</button>
      )
    }
  
  }
  
  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  handlePlay() {

    this.props.onPlay(this.props.track.preview_url)

  }

  render() {
    return (
      <div class="Track">
        <div className="Track-information">
          <h3>{this.props.track && this.props.track.name}</h3>
          <p>{this.props.track && this.props.track.artist} | {this.props.track && this.props.track.album} </p>
        </div>
        <button className="Track-action" >
          {this.renderAction()}
        </button>
        <button className="Track-action"
        onClick={this.handlePlay}>Play</button>
        
        
      </div>
    );
  }
}
