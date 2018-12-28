import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { Col, CardBody, Container } from "reactstrap";
//
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import AutoSuggester from "./autoSuggester.jsx";
import { categories } from "./SongFormNav.jsx";
import Basics from "./songFormPages/Basics.jsx";
import Personnel2 from "./songFormPages/Personnel2.jsx";
import WhiteOut from "../../components/Modals/WhiteOut.jsx";
//

export class SongForm extends Component {
  onSubmit = values => {
    const { songId } = this.props;
    console.log("values from song form", values);
    if (!songId) throw new Error("no song id");
    if (songId === "new") this.createSong(values);
    else this.updateSong(values);
  };
  createSong = values => {
    const { firestore, firebase, history } = this.props;
    firestore
      .add(
        { collection: "songs" },
        { ...values, adminId: firebase.auth().currentUser.uid }
      )
      .then(({ id }) => {
        history.push(`/admin/songs/${id}`);
      });
  };
  updateSong = values => {
    const { firestore, songId } = this.props;
    firestore.update(
      {
        collection: "songs",
        doc: songId
      },
      values
    );
  };
  deletePerson = () => {
    const { firestore, songId, song } = this.props;
    if (!song.adminId) return null;
    firestore.update(
      {
        collection: "songs",
        doc: songId
      },
      {
        adminId: ""
      }
    );
  };

  formDisplay = () => {
    const { songId, page } = this.props;
    // const vibesPage = <div>dummy Vibes Page</div>;
    // const filesPage = <div>dummy Files Page</div>;
    const soundsPage = <div>dummy Sounds Page</div>;
    const topicsPage = <div>dummy Topics Page</div>;
    const pageMap = {
      Basics: <Basics songId={songId} />,
      Personnel: <Personnel2 handleShowWhiteOut={this.handleShowWhiteOut} />,
      Vibes: (
        <Col xs={12} md={4}>
          <AutoSuggester
            attribute="styleDescription"
            label="Style Tags"
            placeholder="add styles"
            key={songId}
            options={[
              { name: "Happy", value: "Happy" },
              { name: "Sad", value: "Sad" },
              { name: "Stupid", value: "Stupid" },
              { name: "Foggy", value: "Foggy" },
              { name: "Stinky", value: "Stinky" },
              { name: "Sleepy", value: "Sleepy" }
            ]}
          />
        </Col>
      ),
      Sounds: soundsPage,
      Topics: topicsPage
    };
    return (
      <CardBody style={{ position: "relative" }}>
        <WhiteOut>
          {/* <Swiper index={page}> */}
          {/* {categories.map(page => { */}
          <Container key={page}>{pageMap[categories[page]]}</Container>
          {/* })} */}
          {/* </Swiper> */}
        </WhiteOut>
      </CardBody>
    );
  };
  render() {
    const { song, songId, people } = this.props;

    if (isLoaded(song) && isLoaded(people) && isLoaded(songId))
      return this.formDisplay();
    else return <LoadingSpinner />;
  }
}
const mapState = state => ({
  account:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[state.firebase.auth.uid],
  song: state.current.songs,
  songId: state.current.id,
  people: state.firestore.ordered.people,
  groups: state.firestore.ordered.groups,
  albums: state.firestore.ordered.albums
});
export default compose(
  connect(mapState),
  firestoreConnect(),
  withRouter
)(SongForm);
