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
          <SelectInput
            name="artist"
            label="Artist/Band"
            options={groups.map(group => ({
              display: group.title,
              value: group.id
            }))}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={8}>
          {/* {Object.keys(peopleAttributes).map(role => {
            return (
              <CheckboxGroup
                key={role}
                label={role}
                options={peopleOptions(role)}
                name={role}
              />
            );
          })} */}
        </Col>
      </Row>
    </>
  );
};

export default SongFormBasics;
