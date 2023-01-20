import React from "react";
import ReactDOM from "react-dom";

export class SpotifyPlayer extends React.Component {
    
    componentWillReceiveProps(nextProps) {
        // Find some DOM nodes
        const element = ReactDOM.findDOMNode(this);
        const audio = element.querySelector('audio');
        const source = audio.querySelector('source');
    
        // When the url changes, we refresh the component manually so it reloads the loaded file
        
        if ((nextProps.src) && (nextProps.src !== this.props.src)) {
          // Change the source
          source.src = nextProps.src;
          // Cause the audio element to load the new source
          audio.load();
        }
        
        
      }
      render() {
        return (
          <div>
            <audio controls autoPlay>
              <source src={this.props.src} />
            </audio>
          </div>
        );
      }
}
