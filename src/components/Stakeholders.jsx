import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
//
import StakeholdersForm from "../forms/formComponents/StakeHoldersForm.jsx";
import StakeholdersTable from "./StakeholdersTable.jsx";
import { mapStateWhenReady } from "../helpers";
import LoadingSpinner from "./loadingSpinner.jsx";

export class Stakeholders extends Component {
  render() {
    const { stakeholders } = this.props;
    return (
      <div>
        <h3>All Stakeholders</h3>
        {!stakeholders ? (
          <LoadingSpinner />
        ) : (
          <StakeholdersTable />
          //   Object.keys(stakeholders).map(key => {
          //     const sh = stakeholders[key];
          //     return (
          //       <div>
          //         {sh.firstName} {sh.lastName}
          //       </div>
          //     );
          //   })
        )}
        <hr />
        <hr />
        <StakeholdersForm />
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
)(Stakeholders);
