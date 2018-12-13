import React, { Component } from "react";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import firebase from "firebase";
import { Form, Field } from "react-final-form";
import { withRouter } from "react-router-dom";
import { Button, Row, Col } from "reactstrap";
//
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import TextInput from "./textInput.jsx";
import { CheckboxGroup } from "./index.js";
import ImageDisplayer from "../../components/ImageDisplayer.jsx";
import { showMe } from "../../helpers";

export class StakeHoldersForm extends Component {
  onSubmit = values => {
    console.log("values from form", values);
    if (this.props.personId === "new") this.createPerson(values);
    else this.updatePerson(values);
  };
  updatePerson = values => {
    const { firestore, personId } = this.props;
    firestore.update(
      {
        collection: "people",
        doc: personId
      },
      values
    );
  };
  createPerson = values => {
    const { firestore } = this.props;
    firestore
      .add(
        { collection: "people" },
        { ...values, adminId: firebase.auth().currentUser.uid }
      )
      .then(({ id }) => {
        this.props.history.push(`/admin/people/${id}`);
      });
  };
  deletePerson = () => {
    const { firestore, person, personId } = this.props;
    if (!person.adminId) return null;
    firestore.update(
      {
        collection: "people",
        doc: personId
      },
      {
        adminId: ""
      }
    );
  };
  render() {
    const { person, account, personId } = this.props;
    const attributeNames = account && Object.keys(account.peopleAttributeNames);
    const attrNameOptions =
      attributeNames &&
      attributeNames.map(attr => ({
        value: attr,
        display: attr
      }));

    return (
      <div>
        <Form onSubmit={this.onSubmit} initialValues={person}>
          {({ handleSubmit, pristine }) => {
            return (
              <form onSubmit={handleSubmit}>
                {/* <Row>
                  <Col>{showMe(values, "values")}</Col>
                </Row> */}
                <Row>
                  <Col xs={8}>
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
                    <Row>
                      <Col xs={12} sm={6}>
                        {" "}
                        <TextInput
                          name="email"
                          label="Email"
                          placeholder="Email"
                        />
                      </Col>
                      <Col xs={12} sm={6}>
                        <CheckboxGroup
                          label="Default Roles"
                          options={attrNameOptions}
                          name="Roles"
                        />
                      </Col>
                    </Row>
                    <Row />
                    <Row />
                  </Col>
                  <Col xs={4}>
                    {person.adminId && <ImageDisplayer person={person} />}
                  </Col>
                </Row>
                <Row>
                  <Col className="bg-light d-flex justify-content-between">
                    <Button
                      disabled={pristine}
                      color={pristine ? "muted" : "primary"}
                      outline={pristine}
                    >
                      {personId === "new"
                        ? "Create New"
                        : pristine
                        ? "Saved"
                        : "Save Changes"}
                    </Button>
                    {person.adminId && (
                      <Button
                        onClick={this.deletePerson}
                        color="danger"
                        outline
                        size="sm"
                      >
                        Delete person
                      </Button>
                    )}
                  </Col>
                </Row>
                {/* <Button onClick={!person ? reset : initialize}>Reset</Button> */}
              </form>
            );
          }}
        </Form>
      </div>
    );
  }
}
const mapState = (state, props) => ({
  account:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[state.firebase.auth.uid],
  person: state.current.people,
  personId: state.current.id
});
export default compose(
  firestoreConnect(),
  connect(mapState),
  withRouter
)(StakeHoldersForm);
