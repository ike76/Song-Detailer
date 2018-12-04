import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "react-final-form";
import { Button, Row, Col } from "reactstrap";
// my stuff
import SongPlayer from "../components/SongPlayer.jsx";
import { getAllSongs, createSong, updateSong } from "../actions/songActions";
import { getAllPeople } from "../actions/peopleActions";
import {
  TextInput,
  SelectInput,
  CheckboxGroup,
  DateInput
} from "./formComponents";
import { arch } from "os";
import LoadingSpinner from "../components/loadingSpinner.jsx";

const artistSelectOptions = [
  { display: "The White Strips", value: "white234235" },
  { display: "The Rolling Turds", value: "turds987654" },
  { display: "Barbara Streisand", value: "babs654312" }
];
const composerOptions = [
  { display: "Turd Furgrson", value: "turfur12345" },
  { display: "John Lennon", value: "lennon12345" },
  { display: "Paul McCartney", value: "macca654321" }
];
const publisherOptions = [
  { display: "Trrds L.L.C.", value: "trdLLC75615" },
  { display: "JLPM tunes", value: "JLPMtunes123456" }
];

export class SongBasics extends Component {
  handleSubmit = values => {
    console.log("values from form", values);
    const { updateSong, createSong } = this.props;
    values._id ? updateSong(values) : createSong(values);
  };
  validate = values => {
    const errors = {};
    if (!values.title) errors.title = "Song Title Required";
    return errors;
  };
  async componentDidMount() {
    console.log("song basics ppl", this.props.allPeople);
    // TODO this would come from context or redux
  }

  getComposers() {
    if (!this.props.people) return "ooooo";
    console.log("thispropspeople", this.props.people);
    const composers = this.props.people.reduce((arr, person) => {
      const composer = {
        display: `${person.firstName} ${person.lastName}`,
        value: person._id
      };
      arr.push(composer);
      return arr;
    }, []);
    return composers;
  }
  render() {
    const { peopleFetching, allPeople, currentSong } = this.props;
    const composers =
      allPeople &&
      allPeople.reduce((arr, person) => {
        arr.push({
          display: `${person.firstName} ${person.lastName}`,
          value: person._id
        });
        return arr;
      }, []);
    console.log("composers, fetching", composers, peopleFetching);
    return (
      <>
        <h1>Basics</h1>
        <SongPlayer />
        <h5>
          current song: {this.props.currentSong && this.props.currentSong.title}
        </h5>
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validate}
          initialValues={this.props.currentSong}
          render={({ handleSubmit, values, submitting, pristine }) => (
            <form onSubmit={handleSubmit}>
              <p>{JSON.stringify(values)}</p>

              <Row>
                <Col xs={12} sm={6}>
                  <TextInput name="title" label="Song Title" />
                </Col>
                <Col xs={12} sm={6}>
                  <SelectInput
                    name="artistBand"
                    label="Artist / Band"
                    options={artistSelectOptions}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6}>
                  {!composers || peopleFetching ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <CheckboxGroup
                        name="composers"
                        label="Composers"
                        options={composers}
                      />
                    </>
                  )}
                </Col>
                <Col xs={12} sm={6}>
                  <CheckboxGroup
                    name="publishers"
                    label="Publishers"
                    options={publisherOptions}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <DateInput
                    name="releaseDate"
                    label="Release Date"
                    viewMode="months"
                  />
                </Col>
                <Col xs={6}>{/* image uploader */}</Col>
              </Row>

              <Button onClick={handleSubmit}>
                {currentSong ? "Update" : "Save"}
              </Button>
            </form>
          )}
        />
        <Button color={"warning"} onClick={this.props.getAllSongs}>
          Get Songs
        </Button>
        <Button color={"warning"} onClick={this.props.getAllPeople}>
          Get People
        </Button>
      </>
    );
  }
}
const mapDispatch = {
  getAllSongs,
  getAllPeople,
  createSong,
  updateSong
};
const mapState = state => ({
  songs: state.songs.allSongs,
  currentSong: state.songs.allSongs[state.songs.currentSongId],
  allPeople: state.people.allPeople,
  peopleFetching: state.people.isFetching
});
export default connect(
  mapState,
  mapDispatch
)(SongBasics);
