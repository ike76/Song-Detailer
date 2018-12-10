import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap";
//
import Stakeholders from "../components/Stakeholders.jsx";
import PeopleAdmin from "../components/PeopleAdmin.jsx";
import LoadingSpinner from "../components/loadingSpinner.jsx";
import CurrentSetter from "../components/CurrentSetter.jsx";

export class AdminPage extends Component {
  state = {
    admins: {},
    songs: {}
  };
  componentDidUpdate(prevProps) {
    console.log("requesting", this.props.requesting);
    console.log("requested", this.props.requested);
  }

  subPages = {
    people: <PeopleAdmin personId={this.props.match.params.id} />
  };
  render() {
    const {
      match: { url }
    } = this.props;
    console.log("url", url);
    return (
      <div className="container">
        <CurrentSetter
          key={this.props.match.url}
          id={this.props.match.params.id}
        />
        <h1>Admin Page</h1>
        <Nav pills>
          <NavItem>
            <NavLink>
              <Link to="/admin/songs"> Songs</Link>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Link to="/admin/people">People</Link>
            </NavLink>
          </NavItem>
        </Nav>
        <hr />
        {this.subPages[this.props.match.params.section]}
      </div>
    );
  }
}
const mapState = state => ({
  stakeholders: state.firestore.data.people,
  requesting: state.firestore.status.requesting,
  requested: state.firestore.status.requested
});
const mapDispatch = {};
export default compose(
  firestoreConnect([
    {
      collection: "people",
      where: ["adminId", "==", "u1kCkvashmdyiYlr5AOSTTY0eNL2"]
    },
    {
      collection: "accounts",
      doc: "u1kCkvashmdyiYlr5AOSTTY0eNL2"
    }
  ]),
  connect(
    mapState,
    mapDispatch
  )
)(AdminPage);
