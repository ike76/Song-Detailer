import React, { Component } from "react";
import {
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import classnames from "classnames";
//
import LoadingSpinner from "../../../components/loadingSpinner.jsx";
import { showMe } from "../../../helpers";
import PersonnelGroupPicker from "./PersonnelGroupPicker.jsx";
import PersonnelGroupCard from "./PersonnelGroupCard.jsx";
export class Personnel extends Component {
  toggleRoleForPerson(role, personId) {
    const { firestore, currentSong, currentSongId } = this.props;
    const roleArray = currentSong[role] || [];
    let newRoleArray;
    const personHasRole = roleArray.includes(personId);
    if (personHasRole) {
      console.log(`removing ${personId} from ${role}`);
      console.log("oldRoleArray", roleArray);
      newRoleArray = [...roleArray.filter(r => r !== personId)];
    } else {
      console.log(`adding ${personId} to ${role}`);
      newRoleArray = [...roleArray, personId];
    }
    console.log("newRoleArray", newRoleArray);

    firestore.update(
      {
        collection: "songs",
        doc: currentSongId
      },
      {
        [role]: newRoleArray
      }
    );
  }
  personnelTable = () => {
    const { currentSong, people, account } = this.props;
    const { peopleAttributeNames } = account;
    return (
      <>
        <Row>
          <Col xs={12} sm={3}>
            <PersonnelGroupPicker />
          </Col>
          {/* <Col xs={12} sm={9}>
            <Row>
              {Object.keys(peopleAttributeNames).map(role => {
                const peopleList = currentSong[role].map(personId => ({
                  ...people[personId],
                  id: personId
                }));
                if (peopleList.length)
                  return (
                    <Col xs={12} sm={6} md={3}>
                      <PersonnelGroupCard
                        roleName={role}
                        peopleList={peopleList}
                      />
                    </Col>
                  );
              })}
            </Row>
          </Col> */}
        </Row>
        <ListGroup flush>
          {Object.keys(people).map(personId => {
            const person = people[personId];
            return (
              <ListGroupItem action className="p-1">
                <Row>
                  <Col xs={12} md={4} className="d-flex align-items-center">
                    <b className="text-uppercase">
                      {person.firstName} {person.lastName}
                    </b>
                  </Col>
                  <Col xs={12} md={8} className="d-flex align-items-center">
                    {peopleAttributeNames &&
                      Object.keys(peopleAttributeNames).map(attr => {
                        const personHasRole =
                          currentSong[attr] &&
                          currentSong[attr].includes(personId);
                        return (
                          <Button
                            onClick={() =>
                              this.toggleRoleForPerson(attr, personId)
                            }
                            className={classnames(" btn-sm p-1", {
                              "btn-link text-black-50": !personHasRole,
                              "btn-info": personHasRole
                            })}
                          >
                            {attr}
                          </Button>
                        );
                      })}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })}

          {showMe(currentSong, "currentSong")}
          {showMe(people, "people")}
          <ListGroupItem action>hiya</ListGroupItem>
          <ListGroupItem action>hiya</ListGroupItem>
        </ListGroup>
      </>
    );
  };
  render() {
    const {
      currentSong,
      currentSongId,
      currentResourceType,
      people,
      account,
      groups
    } = this.props;
    if (
      currentResourceType === "songs" &&
      currentSong &&
      currentSongId &&
      people &&
      account &&
      groups
    ) {
      return this.personnelTable();
    } else {
      return <LoadingSpinner />;
    }
  }
}

const mapState = state => ({
  currentSong: state.current.songs,
  currentSongId: state.current.id,
  currentResourceType: state.current.resourceType,
  people: state.firestore.data.people,
  account: state.firestore.ordered.accounts[0],
  groups: state.firestore.ordered.groups
});
export default compose(
  connect(mapState),
  firestoreConnect()
)(Personnel);
