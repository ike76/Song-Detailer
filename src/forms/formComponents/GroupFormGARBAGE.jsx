import React, { Component } from "react";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip
} from "reactstrap";
import classnames from "classnames";
//
import { showMe } from "../../helpers";
import LoadingSpinner from "../../components/loadingSpinner.jsx";
//

export class GroupForm extends Component {
  onSubmit = values => {
    const { groupId } = this.props;
    console.log("values from song form", values);
    if (!groupId) throw new Error("no song id");
    // if (groupId === "new") this.createGroup(values);
    // else this.updateGroup(values);
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
  togglePersonHavingRole = (personId, role) => {
    const { firestore, groupId, group } = this.props;
    console.log(`toggling ${personId} for ${role}`);
    const revisedPerson = { ...group.members[personId] };
    const personHasRole = revisedPerson[role] && revisedPerson[role].hasRole;
    console.log(`person has role ? ${personHasRole}`);
    revisedPerson[role] = { ...revisedPerson[role], hasRole: !personHasRole };
    firestore.update(
      {
        collection: "groups",
        doc: groupId
      },
      {
        members: { ...group.members, [personId]: revisedPerson }
      }
    );
  };
  togglePersonInGroup = personId => {
    const { group, firestore, groupId, people } = this.props;
    const personIsInGroup =
      group.members[personId] && group.members[personId].inGroup;
    let newGroupMembers;
    if (personIsInGroup) {
      // remove person
      newGroupMembers = { ...group.members };
      newGroupMembers[personId] = {
        ...newGroupMembers[personId],
        inGroup: false
      };
    } else {
      newGroupMembers = group.members ? { ...group.members } : {};
      if (newGroupMembers[personId]) {
        // add person to group with previous roles
        newGroupMembers[personId] = {
          ...newGroupMembers[personId], // <-- previous roles
          inGroup: true
        };
      } else {
        // if new to group, give person default roles
        const defaultRoles = people[personId].Roles
          ? people[personId].Roles.reduce((obj, role) => {
              obj[role.toLowerCase()] = { hasRole: true };
              return obj;
            }, {})
          : {};
        newGroupMembers[personId] = {
          inGroup: true,
          ...defaultRoles
        };
      }
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
    const { group, people, account } = this.props;
    const { peopleAttributeNames } = account;
    const roles = Object.keys(peopleAttributeNames);
    return (
      <>
        <Row>
          <ListGroup className="w-100">
            {/* people who are IN the group */}
            {Object.keys(group.members).map(personId => {
              const person = people[personId];
              if (!group.members[personId].inGroup) return null;
              return (
                <ListGroupItem action className="p-0">
                  <Row>
                    <Col
                      xs={12}
                      md={4}
                      className="justify-content-center d-flex align-items-center"
                    >
                      <span className="">{`${person.firstName} ${
                        person.lastName
                      }`}</span>
                    </Col>
                    <Col
                      xs={12}
                      md={8}
                      className="col-12 col-md-8 d-flex justify-content-center flex-wrap pt-1"
                    >
                      {/* ROLES buttons for each person */}
                      {roles.map(_role => {
                        const role = _role.toLowerCase();
                        return (
                          <Button
                            onClick={() =>
                              this.togglePersonHavingRole(personId, role)
                            }
                            key={role}
                            size="sm"
                            className={classnames("mt-0 mb-1", {
                              "btn-outline-info":
                                !group.members[personId][role] ||
                                !group.members[personId][role].hasRole
                            })}
                          >
                            {role}
                          </Button>
                        );
                      })}
                      <span className=" text-danger d-flex align-items-center ml-2">
                        <i
                          className="fas fa-minus-circle"
                          id={`deleteTooltip${personId}`}
                        />
                        <UncontrolledTooltip
                          placement="top"
                          target={`deleteTooltip${personId}`}
                          autohide={false}
                        >
                          <div>
                            remove{" "}
                            <strong>{person.firstName.toUpperCase()}</strong>{" "}
                            from group?
                          </div>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => this.togglePersonInGroup(personId)}
                          >
                            remove
                          </Button>
                        </UncontrolledTooltip>
                      </span>
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
              {Object.keys(people)
                .filter(
                  key => !group.members[key] || !group.members[key].inGroup
                )
                .map(key => {
                  const person = people[key];
                  return (
                    <Button
                      key={key}
                      size="sm"
                      className="btn-outline-info"
                      onClick={() => this.togglePersonInGroup(key)}
                    >
                      {person.firstName} {person.lastName}
                      <i className="ml-2 fas fa-plus-circle ml-2" />
                    </Button>
                  );
                })}
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
    const { account, group, groupId, people } = this.props;
    if (
      isLoaded(account) &&
      isLoaded(groupId) &&
      isLoaded(people) &&
      isLoaded(group) &&
      true
    ) {
      return groupId !== "none" ? (
        this.formDisplay()
      ) : (
        <div>no group selected</div>
      );
    } else return <LoadingSpinner />;
  }
}
const mapState = state => ({
  account:
    state.firestore.data.accounts &&
    state.firestore.data.accounts[state.firebase.auth.uid],
  group: state.current.groups,
  groupId: state.current.id,
  people: state.firestore.data.people
});
export default compose(
  connect(mapState),
  firestoreConnect(),
  withRouter
)(GroupForm);
