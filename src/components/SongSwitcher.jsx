import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Input, FormGroup, Label } from "reactstrap";
// mine
import { setCurrent } from "../actions/currentActions";
import LoadingSpinner from "./loadingSpinner.jsx";
const SongSwitcher = ({ songsFS, currentSongId, setCurrent }) => {
  console.log("current id", currentSongId);
  return !songsFS ? (
    LoadingSpinner
  ) : (
    <FormGroup>
      <Label>Song:</Label>
      <Input
        type="select"
        onChange={e => setCurrent("song", e.target.value)}
        value={currentSongId ? currentSongId : ""}
      >
        {Object.keys(songsFS).map(songId => (
          <option key={songId} value={songId}>
            {songsFS[songId].title}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
};
const mapState = state => ({
  songs: state.songs.allSongs,
  currentSongId: state.current.song,
  songsFS: state.firestore.data.songs
});
const mapDispatch = {
  setCurrent
};
export default compose(
  firestoreConnect(["songs"]),
  connect(
    mapState,
    mapDispatch
  )
)(SongSwitcher);
