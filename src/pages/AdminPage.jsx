import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Row, Col, Button } from "reactstrap";
//
import Stakeholders from "../components/Stakeholders.jsx";
import LoadingSpinner from "../components/loadingSpinner.jsx";
export class AdminPage extends Component {
  state = {
    admins: {},
    songs: {}
  };
  componentDidUpdate(prevProps) {
    console.log("requesting", this.props.requesting);
    console.log("requested", this.props.requested);
  }
  toggleCool = userId => {
    const person = this.props.stakeholders[userId];
    const { firestore } = this.props;
    firestore.update(
      {
        collection: "accounts",
        doc: accountNumber,
        subcollections: [{ collection: "stakeholders", doc: userId }]
      },
      { cool: person.cool ? false : true }
    );
  };
  render() {
    const { stakeholders, songs, admins } = this.props;
    return (
      <div className="container">
        <h1>Admin Page</h1>
        <hr />
        <Stakeholders />
        <h3>Admins</h3>
        {!admins ? (
          <LoadingSpinner />
        ) : (
          <code>{JSON.stringify(admins, 0, 2)}</code>
        )}
        <hr />
        <h3>Songs</h3>
        {!songs ? (
          <LoadingSpinner />
        ) : (
          <>
            <code>{JSON.stringify(songs, 0, 2)}</code>
            <Row>
              {Object.keys(songs).map(key => {
                const song = songs[key];
                return (
                  <Col>
                    <h4>{song.title}</h4>
                    <ul>
                      {song.writers.map(pid => {
                        const writer = stakeholders && stakeholders[pid];
                        return (
                          <li key={pid}>
                            {writer && `${writer.firstName} ${writer.lastName}`}
                          </li>
                        );
                      })}
                    </ul>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
        <hr />

        {/* {!stakeholders ? (
          <LoadingSpinner />
        ) : (
          <>
            <code>{JSON.stringify(stakeholders, 0, 2)}</code>
            <Row>
              {Object.keys(stakeholders).map(key => {
                const person = stakeholders[key];
                const fullName = `${person.firstName} ${person.lastName}`;
                return (
                  <Col key={key} xs="3">
                    <h3>{fullName}</h3>
                    <p>{key}</p>
                    <Button
                      size="sm"
                      color={person.cool ? "primary" : "dark"}
                      onClick={() => this.toggleCool(key)}
                    >
                      {person.cool ? "cool" : "not cool"}
                    </Button>
                  </Col>
                );
              })}
            </Row>
          </>
        )} */}
      </div>
    );
  }
}
const accountNumber = "hAEoRLPjh97E5FBbxKpM";
const mapState = state => ({
  account:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[accountNumber],
  admins:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[accountNumber].admins,
  songs:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[accountNumber].songs,
  stakeholders:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[accountNumber].stakeholders,
  requesting: state.firestore.status.requesting,
  requested: state.firestore.status.requested
});
const mapDispatch = {};
export default compose(
  firestoreConnect([
    // `accounts/${accountNumber}/admins`,
    // `accounts/${accountNumber}/songs`,
    // `accounts/${accountNumber}/stakeholders`
    {
      collection: "accounts",
      doc: accountNumber,
      subcollections: [{ collection: "stakeholders" }]
    },
    {
      collection: "accounts",
      doc: accountNumber,
      subcollections: [{ collection: "songs" }]
    },
    {
      collection: "accounts",
      doc: accountNumber,
      subcollections: [{ collection: "admins" }]
    }
  ]),
  connect(
    mapState,
    mapDispatch
  )
)(AdminPage);
