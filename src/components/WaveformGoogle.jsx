// components/waveform.js
import React from "react";
import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer.js";
import { Button, FormGroup } from "reactstrap";
import LoadingSpinner from "./loadingSpinner.jsx";
export default class Waveform extends React.Component {
  state = {
    playing: false,
    volume: 80,
    ready: false
  };
  componentDidMount() {
    this.$el = ReactDOM.findDOMNode(this);
    this.$waveform = this.$el.querySelector(".wave");
    this.wavesurfer = WaveSurfer.create({
      container: this.$waveform,
      waveColor: "violet",
      progressColor: "blue",
      barWidth: 3,
      responsive: true
    });
    this.wavesurfer.load(this.props.src);
    this.wavesurfer.on("ready", this.waveReady);
  }
  waveReady = () => {
    this.setState({ ready: true });
  };
  playPause = () => {
    this.state.playing
      ? this.setState({ playing: false }, this.wavesurfer.pause())
      : this.setState({ playing: true }, this.wavesurfer.play());
  };
  changeVolume = e => {
    const newVolume = e.target.value;
    this.setState(
      { volume: newVolume },
      this.wavesurfer.setVolume(newVolume / 100)
    );
  };

  componentWillUnmount() {}
  render() {
    const { title, subTitle } = this.props;
    return (
      <div className="waveform">
        <div className="d-flex justify-content-around align-items-center">
          <div style={{ lineHeight: "10px" }}>
            <h6 className="m-0">{title}</h6>
            <span>
              <small className="text-muted text-uppercase">{subTitle}</small>
            </span>
          </div>
          <form>
            <div className="form-group mx-2 my-0">
              <label for="formControlRange">volume {this.state.volume}%</label>
              <input
                type="range"
                className="form-control-range"
                id="formControlRange"
                onChange={this.changeVolume}
                value={this.state.volume}
              />
            </div>
          </form>
          <Button
            className="btn-round btn-icon mx-2"
            onClick={this.playPause}
            disabled={!this.state.ready}
          >
            {this.state.playing ? (
              <i className="fas fa-pause" />
            ) : (
              <i class="fas fa-play" />
            )}
          </Button>
        </div>
        <div className="wave">{!this.state.ready && <LoadingSpinner />}</div>
      </div>
    );
  }
}
// <i class="far fa-play-circle"></i>
//<i class="far fa-pause-circle"></i>

Waveform.defaultProps = {
  src: ""
};
