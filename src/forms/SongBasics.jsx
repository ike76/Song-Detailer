import React, { Component } from "react";
import { Form } from "react-final-form";
import { Button, Row, Col } from "reactstrap";
import Moment from "moment";
import SongPlayer from "../components/SongPlayer.jsx";
// my stuff
import {
  TextInput,
  SelectInput,
  CheckboxGroup,
  DateInput
} from "./formComponents";

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
  };
  validate = values => {
    const errors = {};
    if (!values.songTitle) errors.songTitle = "Song Title Required";
    return errors;
  };
  componentDidMount() {
    // TODO this would come from context or redux
    this.setState({
      songTitle: "You Hurt My Teeth",
      artistBand: "turds987654",
      composer: ["lennon12345"],
      releaseDate: new Moment("2018-12-07T06:00:00.000Z")
    });
  }
  render() {
    return (
      <>
        <h1>Basics</h1>
        <SongPlayer />
        <Form
          onSubmit={this.handleSubmit}
          validate={this.validate}
          initialValues={this.state}
          render={({ handleSubmit, values, submitting, pristine }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={6}>
                  <TextInput name="songTitle" label="Song Title" />
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
                  <CheckboxGroup
                    name="composer"
                    label="Composer"
                    options={composerOptions}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <CheckboxGroup
                    name="publisher"
                    label="Publisher"
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
              </Row>

              <Button onClick={handleSubmit}>Save</Button>
            </form>
          )}
        />
      </>
    );
  }
}

export default SongBasics;
