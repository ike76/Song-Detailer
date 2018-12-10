import React, { Component } from "react";
import { Image, Transformation } from "cloudinary-react";
import axios from "axios";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Dropzone from "react-dropzone";
import LoadingSpinner from "./loadingSpinner";
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL;

export class ImageDisplayer extends Component {
  state = {
    uploading: false,
    public_id: null
  };
  componentDidMount() {
    // this.setState({ public_id: this.props.profileImage });
  }
  updateFirestore = public_id => {
    return this.props.firestore.update(
      {
        collection: "people",
        doc: this.props.personId
      },
      {
        profileImage: public_id
      }
    );
  };
  handleUploadImages = (images, onChange) => {
    this.setState({ uploading: true });
    const formData = new FormData();
    const uploads = images.map(image => {
      formData.append("file", image);
      formData.append("tags", ["profile image"]); // Add tags for the images - {Array}
      formData.append("upload_preset", "song-detailer"); // Replace the preset name with your own
      formData.append("api_key", CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary API key
      formData.append("timestamp", (Date.now() / 1000) | 0);
      return axios
        .post(
          `https://api.cloudinary.com/v1_1/homecomp/image/upload`,
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" }
          }
        )
        .then(({ data }) => {
          console.log("cloud response", data);
          //   this.props.change("profileImage", data.public_id);
          this.updateFirestore(data.public_id);
          this.setState({ uploading: false, public_id: data.public_id });
        })
        .catch(err => console.error("cloud error", err));
    });
  };
  render() {
    const { person } = this.props;
    let public_id = this.state.publicId || (person && person.profileImage);
    return (
      <>
        <Dropzone
          onDrop={images => this.handleUploadImages(images)}
          multiple
          accept="image/*"
        >
          {this.state.uploading ? (
            <LoadingSpinner />
          ) : !public_id ? (
            <img src="https://via.placeholder.com/200x200?text=Drop+Image+Here" />
          ) : (
            <Image
              cloudName="homecomp"
              publicId={public_id}
              className="d-block"
            >
              <Transformation
                gravity="face:center"
                height="200"
                width="200"
                crop="fill"
              />
            </Image>
          )}
        </Dropzone>
      </>
    );
  }
}
const mapState = (state, props) => ({
  person: props.person
});
export default compose(
  connect(mapState),
  firestoreConnect()
)(ImageDisplayer);
