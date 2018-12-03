import React, { Component } from "react";
import AudioPlayer from "react-audio-player";
export class SongPlayer extends Component {
  render() {
    return (
      <div>
        <AudioPlayer />
      </div>
    );
  }
}

export default SongPlayer;
