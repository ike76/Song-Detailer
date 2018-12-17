import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { Nav, NavItem } from "reactstrap";
//
import PeopleAdmin from "../components/PeopleAdmin.jsx";
import SongsAdmin from "../components/SongsAdmin.jsx";
import GroupsAdmin from "../components/GroupsAdmin";
import CurrentSetter from "../components/CurrentSetter.jsx";

export class AdminPage extends Component {
  state = {
    admins: {},
    songs: {}
  };
  componentDidUpdate(prevProps) {
    // console.log("requesting", this.props.requesting);
    // console.log("requested", this.props.requested);
  }

  subPages = {
    people: (
      <PeopleAdmin
        key={this.props.match.params.id}
        personId={this.props.match.params.id}
      />
    ),
    songs: (
      <SongsAdmin
        key={this.props.match.params.id}
        songId={this.props.match.params.id}
      />
    ),
    groups: (
      <GroupsAdmin
        key={this.props.match.params.id}
        groupId={this.props.match.params.id}
      />
    )
  };
  render() {
    return (
      <div className="container">
        <CurrentSetter
          key={this.props.match.url}
          id={this.props.match.params.id}
        />
        <h1>Admin Page</h1>
        <Nav pills>
          <NavItem>
            <Link className="nav-link" to="/admin/songs">
              Songs
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/admin/people">
              People
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/admin/groups">
              Groups
            </Link>
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
const adminFilter = ["adminId", "==", "u1kCkvashmdyiYlr5AOSTTY0eNL2"];
export default compose(
  firestoreConnect([
    {
      collection: "people",
      where: adminFilter
    },
    {
      collection: "accounts",
      doc: "u1kCkvashmdyiYlr5AOSTTY0eNL2"
    },
    {
      collection: "songs",
      where: adminFilter
    },
    {
      collection: "groups",
      where: adminFilter
    },
    {
      collection: "albums",
      where: adminFilter
    }
  ]),
  connect(
    mapState,
    mapDispatch
  )
)(AdminPage);
