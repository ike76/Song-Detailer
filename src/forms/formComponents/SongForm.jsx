import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Row, Col, CardBody, CardFooter, Container } from "reactstrap";
import { Form } from "react-final-form";
import Swiper from "react-swipeable-views";
//
import { showMe } from "../../helpers";
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import AutoSuggester from "./autoSuggester.jsx";
import { categories } from "./SongFormNav.jsx";
import Basics from "./songFormPages/Basics.jsx";
import Personnel2 from "./songFormPages/Personnel2.jsx";
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
    const { song, songId, peopleAttributes, people, groups } = this.props;
    return (
      <>
        {/* {showMe(peopleAttributes, "peopleAttributes")}
      {showMe(people, "people")} */}
        <Form onSubmit={this.onSubmit} initialValues={song}>
          {({ handleSubmit, pristine, values }) => {
            // const vibesPage = <div>dummy Vibes Page</div>;
            // const filesPage = <div>dummy Files Page</div>;
            const soundsPage = <div>dummy Sounds Page</div>;
            const topicsPage = <div>dummy Topics Page</div>;
            const pageMap = {
              // Files: filesPage,
              Basics: (
                <Basics
                  // key={songId}
                  peopleAttributes={peopleAttributes}
                  groups={groups}
                  songId={songId}
                  people={people}
                />
              ),
              Personnel: <Personnel2 />,
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
              <form onSubmit={handleSubmit}>
                <CardBody>
                  <Row>
                    <Swiper index={this.props.page}>
                      {categories.map(page => {
                        return (
                          <Container key={page}>{pageMap[page]}</Container>
                        );
                      })}
                    </Swiper>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button
                    disabled={pristine}
                    color={pristine ? "muted" : "primary"}
                    outline={pristine}
                  >
                    {songId === "new"
                      ? "Create New"
                      : pristine
                      ? "Saved"
                      : "Save Changes"}
                  </Button>
                  <Row>
                    <Col>{showMe(values, "values")}</Col>
                  </Row>
                </CardFooter>
              </form>
            );
          }}
        </Form>
      </>
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
