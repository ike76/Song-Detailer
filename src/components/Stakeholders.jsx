import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
//
import StakeholdersForm from "../forms/formComponents/PeopleForm.jsx";
import PeopleAdmin from "./PeopleAdmin.jsx";
import LoadingSpinner from "./loadingSpinner.jsx";

export class Stakeholders extends Component {
  render() {
    const { stakeholders } = this.props;
    return (
      <div>
        <PeopleAdmin />
      </div>
    );
  }
}

const mapState = state => ({
  stakeholders: state.firestore.data.people
});
export default compose(connect(mapState))(Stakeholders);
