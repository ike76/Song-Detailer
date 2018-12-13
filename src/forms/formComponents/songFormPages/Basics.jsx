import React from "react";
import { Row, Col } from "reactstrap";
//
import TextInput from "../textInput.jsx";
import SelectInput from "../selectInput.jsx";
import { CheckboxGroup } from "../index.js";
import AutoSuggester from "../autoSuggester.jsx";

const SongFormBasics = ({ peopleAttributes, groups, songId, people }) => {
  const peopleOptions = role => {
    const peopleAttrs = people
      .filter(p => p.Roles && p.Roles.includes(role))
      .map(p => ({
        value: p.id,
        display: p.firstName
      }));
    return peopleAttrs;
  };
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
          {Object.keys(peopleAttributes).map(role => {
            return (
              <CheckboxGroup
                key={role}
                label={role}
                options={peopleOptions(role)}
                name={role}
              />
            );
          })}
        </Col>
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
      </Row>
    </>
  );
};

export default SongFormBasics;
