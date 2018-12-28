import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { Nav, NavItem } from "reactstrap";
import classnames from "classnames";
//
import PeopleAdmin from "../components/PeopleAdmin.jsx";
import SongsAdmin from "../components/SongsAdmin.jsx";
import GroupsAdmin from "../components/GroupsAdmin";
import CurrentSetter from "../components/CurrentSetter.jsx";
import AlbumsAdmin from "../components/AlbumsAdmin.jsx";

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
    ),
    albums: (
      <AlbumsAdmin
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
        <Nav pills>
          {["songs", "albums", "people", "groups"].map(section => (
            <NavItem key={section}>
              <Link
                className={classnames("nav-link", {
                  active: this.props.match.params.section === section
                })}
                to={`/admin/${section}`}
              >
                <span className="text-capitalize">{section}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
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
