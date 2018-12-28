import React, { Component } from "react";
import Waveform from "./Waveform.jsx";
import { Button } from "reactstrap";
import Dropzone from "react-dropzone";
import { firebaseConnect } from "react-redux-firebase";
import firebase from "firebase";
import { compose } from "redux";

export class AudioPlayer extends Component {
  handleFile = (files, rejects) => {
    // const songUpload = new File(file, "foo.mp3", {
    //   type: file[0].type
    // });
    // const {firebase} = this.props
    const storageRef = firebase.storage().ref();
    // const songRef = storageRef.child("bar.mp3");
    console.log("file", files);
    console.log("reject", rejects);
    // songRef
    //   .put(songUpload)
    //   .then(snapshot => {
    //     console.log("snapshot", snapshot);
    //   })
    //   .catch(err => console.log("upload error", err));
  };

  render() {
    const { title, subTitle } = this.props.values;
    return (
      <>
        <div>
          <Waveform
            src="https://firebasestorage.googleapis.com/v0/b/song-detailer.appspot.com/o/04.Everglow.mp3?alt=media&token=5b8c6da8-cdb7-4a9e-ada1-227e6334c235"
            title={title}
            subTitle={subTitle}
          />
        </div>
        <div>
          <Dropzone
            onDrop={this.handleFile}
            accept="audio/*"
            maxSize={20 * 1024 * 1024}
          />
        </div>
        <div>
          <Button onClick={this.authenticate}>get buckets</Button>
        </div>
      </>
    );
  }
}

export default compose(firebaseConnect())(AudioPlayer);
