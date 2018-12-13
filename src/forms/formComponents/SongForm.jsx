import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "reactstrap";
import { Form, Field } from "react-final-form";
import Swiper from "react-swipeable-views";
//
import TextInput from "./textInput.jsx";
import SelectInput from "./selectInput.jsx";
import { CheckboxGroup } from "./index.js";
import { showMe } from "../../helpers";
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import AutoSuggester from "./autoSuggester.jsx";
import { categories } from "./SongFormNav.jsx";
import Basics from "./songFormPages/Basics.jsx";
//

export class SongForm extends Component {
  onSubmit = values => {
    const { firestore, songId } = this.props;
    console.log("values from song form", values);
    if (!songId) throw new Error("no song id");
    if (songId === "new") this.createSong(values);
    else this.updateSong(values);
  };
  createSong = values => {
    const { firestore, songId, firebase, history } = this.props;
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
    const {
      song,
      songId,
      account,
      peopleAttributes,
      people,
      groups
    } = this.props;
    return (
      <>
        {/* {showMe(peopleAttributes, "peopleAttributes")}
      {showMe(people, "people")} */}
        <Form onSubmit={this.onSubmit} initialValues={song}>
          {({ handleSubmit, pristine, values }) => {
            const vibesPage = <div>dummy Vibes Page</div>;
            const filesPage = <div>dummy Files Page</div>;
            const soundsPage = <div>dummy Sounds Page</div>;
            const topicsPage = <div>dummy Topics Page</div>;
            const pageMap = {
              Files: filesPage,
              Basics: (
                <Basics
                  // key={songId}
                  peopleAttributes={peopleAttributes}
                  groups={groups}
                  songId={songId}
                  people={people}
                />
              ),
              Vibes: vibesPage,
              Sounds: soundsPage,
              Topics: topicsPage
            };
            return (
              <form onSubmit={handleSubmit}>
                <CardBody>
                  <Swiper index={this.props.currentPage}>
                    {categories.map(page => {
                      return pageMap[page];
                    })}
                  </Swiper>
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
    const { song, songId, account, people, groups } = this.props;

    const attributeNames = account && Object.keys(account.peopleAttributeNames);
    const attrNameOptions =
      attributeNames &&
      attributeNames.map(attr => ({
        value: attr,
        display: attr
      }));

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
  albums: state.firestore.ordered.albums,
  peopleAttributes: state.firestore.ordered.accounts[0].peopleAttributeNames,
  currentPage: state.current.songPage || 0
});
export default compose(
  connect(mapState),
  firestoreConnect(),
  withRouter
)(SongForm);
