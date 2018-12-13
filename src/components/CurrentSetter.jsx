import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//
import { setCurrent } from "../actions/currentActions";
import { showMe } from "../helpers";

class CurrentSetter extends Component {
  state = {
    currentSection: null,
    currentId: null
  };
  componentDidUpdate(prevProps, prevState) {
    this.sendCurrentId();
  }
  componentDidMount() {
    const currentSection = this.props.match.params.section;
    const currentId = this.props.match.params.id;
    // const currentPerson = this.props.people[currentId];
    this.setState({ currentSection, currentId });
    this.sendCurrentId();
    // this.props.setCurrent(currentSection, currentPerson);
  }
  sendCurrentId() {
    const { people, songs, groups } = this.props;
    if (isLoaded(people) && isLoaded(songs) && isLoaded(groups)) {
      const resourceType = this.props.match.params.section;
      const currentResource =
        this.props[resourceType][this.props.match.params.id] || {};
      const currentResourceId = this.props.match.params.id || "none";
      this.props.setCurrent(resourceType, currentResource);
      this.props.setCurrent("id", currentResourceId);
    }
  }
  render() {
    return (
      <div>
        <ul>
          <li>section: {this.state.currentSection}</li>
          <li>id: {this.state.currentId}</li>
          {/* <li>people: {showMe(this.props.people, "people")}</li> */}
        </ul>
      </div>
    );
  }
}

const mapState = (state, props) => ({
  people: state.firestore.data.people,
  songs: state.firestore.data.songs,
  groups: state.firestore.data.groups
});
const mapDispatch = {
  setCurrent
};

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  withRouter
)(CurrentSetter);
