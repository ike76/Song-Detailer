import React from "react";
import { connect } from "react-redux";
import { Input, FormGroup, Label } from "reactstrap";
// mine
import { setCurrentSong } from "../actions/songActions";
const SongSwitcher = ({ songs, currentSongId, setCurrentSong }) => {
  console.log("current id", currentSongId);
  return (
    <FormGroup>
      <Label>Song:</Label>
      <Input
        type="select"
        onChange={e => setCurrentSong(e.target.value)}
        value={currentSongId ? currentSongId : ""}
      >
        {Object.keys(songs).map(songId => (
          <option key={songId} value={songId}>
            {songs[songId].title}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
};
const mapState = state => ({
  songs: state.songs.allSongs,
  currentSongId: state.songs.currentSongId
});
const mapDispatch = {
  setCurrentSong
};
export default connect(
  mapState,
  mapDispatch
)(SongSwitcher);
