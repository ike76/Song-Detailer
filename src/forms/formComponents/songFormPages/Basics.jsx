import React from "react";
import { Row, Col } from "reactstrap";
//
import TextInput from "../textInput.jsx";
import SelectInput from "../selectInput.jsx";

const SongFormBasics = ({ groups }) => {
  return (
    <>
      <Row>
        <Col xs={12} md={8}>
          <TextInput name="title" label="Song Title" placeholder="Song Title" />
        </Col>
        <Col xs={12} md={4}>
          <div>upload here</div>
        </Col>
      </Row>
    </>
  );
};

export default SongFormBasics;
