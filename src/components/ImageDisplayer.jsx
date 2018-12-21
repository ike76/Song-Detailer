import React, { Component } from "react";
import axios from "axios";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Dropzone from "react-dropzone";
import LoadingSpinner from "./loadingSpinner";
import styled from "styled-components";
//
import { ImageBox } from "../forms/formComponents/PeopleForm2.jsx";
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;

const Container = styled.div`
  width: 100%;
  border: none;
`;

export class ImageDisplayer extends Component {
  state = {
    uploading: false,
    public_id: null
  };
  componentDidMount() {
    // this.setState({ public_id: this.props.profileImage });
  }
  updateFirestore = public_id => {
    const { person } = this.props;

    return this.props.firestore.update(
      {
        collection: "people",
        doc: person.id
      },
      {
        profileImage: public_id
      }
    );
  };
  handleUploadImages = (images, onChange) => {
    this.setState({ uploading: true });
    const formData = new FormData();
    images.map(image => {
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
          this.updateFirestore(data.public_id);
          this.setState({ uploading: false, public_id: data.public_id });
        })
        .catch(err => console.error("cloud error", err));
    });
  };
  render() {
    const { person, editing } = this.props;
    let public_id = this.state.publicId || (person && person.profileImage);
    return (
      <>
        <Dropzone
          onDrop={images => this.handleUploadImages(images)}
          multiple
          accept="image/*"
          style={{ border: "none", position: "relative" }}
        >
          {props => {
            return (
              <Container
              // isDragActive={isDragActive}
              // isDragReject={isDragReject}
              // {...getRootProps()}
              >
                {this.state.uploading ? (
                  <LoadingSpinner />
                ) : !public_id ? (
                  <img
                    src="https://via.placeholder.com/200x200?text=Drop+Image+Here"
                    alt="drop profile img here"
                  />
                ) : (
                  <>
                    <ImageBox url={public_id} editing={editing}>
                      <h5 style={{ zIndex: 1 }}>Drag new photo here</h5>
                    </ImageBox>
                  </>
                )}
              </Container>
            );
          }}
        </Dropzone>
      </>
    );
  }
}
const mapState = (state, props) => ({});
export default compose(
  connect(mapState),
  firestoreConnect()
)(ImageDisplayer);
