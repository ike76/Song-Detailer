import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Row, Col, ListGroup, ListGroupItem, Badge } from "reactstrap";
import styled from "styled-components";
//
import TextInput from "./textInput.jsx";
import SelectInput from "./selectInput.jsx";
import { CheckboxGroup } from "./index.js";
import { showMe } from "../../helpers";
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import AutoSuggester from "./autoSuggester.jsx";
import { categories } from "./SongFormNav.jsx";
import Basics from "./songFormPages/Basics.jsx";
//

const PeopleGrid = styled.div`
  background: salmon;
`;
export class GroupForm extends Component {
  onSubmit = values => {
    const { groupId } = this.props;
    console.log("values from song form", values);
    if (!groupId) throw new Error("no song id");
    return;
    if (groupId === "new") this.createGroup(values);
    else this.updateGroup(values);
  };
  createGroup = values => {
    const { firestore, firebase, history } = this.props;
    firestore
      .add(
        { collection: "groups" },
        { ...values, adminId: firebase.auth().currentUser.uid }
      )
      .then(({ id }) => {
        history.push(`/admin/groups/${id}`);
      });
  };
  updateGroup = values => {
    const { firestore, groupId } = this.props;
    firestore.update(
      {
        collection: "groups",
        doc: groupId
      },
      values
    );
  };
  deleteGroup = () => {
    const { firestore, groupId, group } = this.props;
    if (!group.adminId) return null;
    firestore.update(
      {
        collection: "groups",
        doc: groupId
      },
      {
        adminId: ""
      }
    );
  };
  toggleRoleForPerson = (person, role) => {};
  togglePersonInGroup = personId => {
    const { group, firestore, groupId } = this.props;
    const personIsInGroup =
      group.members && group.members.find(p => p.id === personId);
    let newGroupMembers;
    if (personIsInGroup) {
      // remove person
      newGroupMembers = group.members.filter(person => person.id !== personId);
    } else {
      // add person to group
      newGroupMembers = group.members ? [...group.members] : [];
      newGroupMembers.push({ id: personId });
    }
    // update firestore
    firestore.update(
      { collection: "groups", doc: groupId },
      {
        members: newGroupMembers
      }
    );
  };
  formDisplay = () => {
    const { group, groupId, people, account } = this.props;
    const { peopleAttributeNames } = account;
    const roles = Object.keys(peopleAttributeNames);
    console.table("roles", roles);
    return (
      <>
        <Row>
          <ListGroup>
            {/* people who are IN the group */}
            {people.map(person => {
              const personInGroup =
                group.members && group.members.find(p => p.id === person.id);
              console.log("person in group", person.firstName, personInGroup);
              return (
                <ListGroupItem action>
                  <Row>
                    <Col xs={12} md={4}>
                      <span className="mr-5">{`${person.firstName} ${
                        person.lastName
                      }`}</span>
                    </Col>
                    <Col xs={12} md={8}>
                      {roles.map(role => (
                        <Button
                          onClick={this.toggleRoleForPerson(null, role)}
                          key={role}
                          size="sm"
                        >
                          {role}
                        </Button>
                      ))}
                      <Button
                        onClick={() => this.togglePersonInGroup(person.id)}
                        className={personInGroup ? "btn-info" : ""}
                      >
                        in group
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </Row>
        <Row>
          {/* people who are NOT in the group */}
          <Col xs={12}>
            <h4>People NOT in this group:</h4>
          </Col>
          <Col>
            <div>
              <span className="border m-2 p-1 rounded">
                Dude Thurston
                <Button className="ml-1" size="sm">
                  add
                </Button>
              </span>
              <span className="border m-2 p-1 rounded">
                Dude Thurston
                <Button className="ml-1" size="sm">
                  add
                </Button>
              </span>
              <span className="border m-2 p-1 rounded">
                Dude Thurston
                <Button className="ml-1" size="sm">
                  add
                </Button>
              </span>
            </div>
          </Col>
        </Row>
        {/* //
        // */}
        <Row>
          <Col>
            {showMe(account, "account")}
            {showMe(group, "group")}
            {showMe(people, "people")}
            <hr />
          </Col>
        </Row>
      </>
    );
  };
  render() {
    if (
      //   isLoaded(account) &&
      //   isLoaded(group) &&
      //   isLoaded(groupId) &&
      //   isLoaded(people) &&
      true
    )
      return this.formDisplay();
    else return <LoadingSpinner />;
  }
}
const mapState = state => ({
  account:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[state.firebase.auth.uid],
  group: state.current.groups,
  groupId: state.current.id,
  people: state.firestore.ordered.people
});
export default compose(
  connect(mapState),
  firestoreConnect(),
  withRouter
)(GroupForm);
