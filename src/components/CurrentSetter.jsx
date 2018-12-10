import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
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
    if (this.props.people) {
      const currentPerson = this.props.people[this.props.match.params.id] || {};
      const currentPersonId = this.props.match.params.id;
      this.props.setCurrent("person", currentPerson);
      this.props.setCurrent("personId", currentPersonId);
    }
  }
  componentDidMount() {
    const currentSection = this.props.match.params.section;
    const currentId = this.props.match.params.id;
    // const currentPerson = this.props.people[currentId];
    this.setState({ currentSection, currentId });
    // this.props.setCurrent(currentSection, currentPerson);
  }
  render() {
    return (
      <div>
        <ul>
          <li>section: {this.state.currentSection}</li>
          <li>id: {this.state.currentId}</li>
          <li>people: {showMe(this.props.people, "people")}</li>
        </ul>
      </div>
    );
  }
}

const mapState = (state, props) => ({
  people: state.firestore.data.people,
  songs: state.firestore.data.songs
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
