import React, { Component } from "react";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Form, Field } from "react-final-form";
import { Button, Row, Col } from "reactstrap";
//
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import TextInput from "./textInput.jsx";
import { mapStateWhenReady } from "../../helpers";

export class StakeHoldersForm extends Component {
  onSubmit = values => {
    console.log("values from form", values);
  };
  componentDidUpdate(prevProps) {
    const { stakeholders, settings } = this.props;
    console.log("stakeholders", stakeholders);
    console.log("settings", settings);
  }
  render() {
    const { stakeholders } = this.props;
    return !stakeholders ? (
      <LoadingSpinner />
    ) : (
      <div>
        <Form onSubmit={this.onSubmit}>
          {({ handleSubmit, pristine, invalid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} sm={6}>
                    <TextInput
                      name="firstName"
                      label="First Name"
                      placeholder="First Name"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    {" "}
                    <TextInput
                      name="lastName"
                      label="Last Name"
                      placeholder="Last Name"
                    />
                  </Col>
                </Row>

                <Button>Save</Button>
              </form>
            );
          }}
        </Form>
      </div>
    );
  }
}

export default compose(
  firestoreConnect((props, store) => [
    {
      collection: "accounts",
      doc: store.getState().current.adminId,
      subcollections: [{ collection: "stakeholders" }]
    },
    {
      collection: "accounts",
      doc: store.getState().current.adminId,
      subcollections: [{ collection: "settings" }]
    }
  ]),
  connect(state => mapStateWhenReady(state, ["stakeholders", "settings"]))
)(StakeHoldersForm);
