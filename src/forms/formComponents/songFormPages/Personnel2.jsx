import React, { Component } from "react";
import {
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
  Container,
  Alert
} from "reactstrap";
import { Form } from "react-final-form";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import pluralize from "pluralize";
import classnames from "classnames";
//
import LoadingSpinner from "../../../components/loadingSpinner.jsx";
import PersonnelGroupPicker from "./PersonnelGroupPicker.jsx";
import TextInput from "../textInput.jsx";

export class Personnel extends Component {
  state = {
    editing: "",
    showOverwriteAlert: false,
    showGroupNameForm: false,
    pendingGroup: "",
    title: "",
    subTitle: "",
    showNamesForm: false
  };
  handleSelectGroup = groupId => {
    console.log("group selected", groupId);
    this.setState({ showOverwriteWarning: true, pendingGroup: groupId });
  };
  cancelSelectGroup = () => {
    this.setState({ showOverwriteWarning: false, pendingGroup: "" });
  };
  confirmOverwrite = () => {
    const { currentSongId, groups, account, firestore } = this.props;
    const { peopleAttributeNames } = account;
    const groupId = this.state.pendingGroup;
    const group = groups[groupId];
    const updateObj = Object.keys(peopleAttributeNames).reduce((obj, role) => {
      obj[role] = group[role];
      return obj;
    }, {});
    firestore
      .update(
        {
          collection: "songs",
          doc: currentSongId
        },
        updateObj
      )
      .then(() => {
        this.setState({ showOverwriteWarning: false });
      });
    // console.log("pplAttributeNames", peopleAttributeNames);
    // console.log("currentSong", currentSong);
    // console.log("group", group);
    // console.log("update obj", updateObj);
  };
  openGroupNameForm = () => {
    this.setState({ showGroupNameForm: true });
  };
  updateGroupName = e => {
    const { value, name } = e.target;
    console.log("namevalue", name, value);
    this.setState({ [name]: value });
  };
  saveThisGroup = () => {
    const { currentSong, account, firestore, firebase } = this.props;
    const { title, subTitle } = this.state;
    const { peopleAttributeNames } = account;
    const newGroup = Object.keys(peopleAttributeNames).reduce((obj, attr) => {
      obj[attr] = currentSong[attr];
      return obj;
    }, {});
    // console.log("newGroup", newGroup);
    // console.log("adminId", firebase.auth().currentUser.uid);
    firestore.add(
      {
        collection: "groups"
      },
      {
        ...newGroup,
        adminId: firebase.auth().currentUser.uid,
        title: title,
        subTitle: subTitle
      }
    );
  };
  editThisRole = role => {
    this.setState({ editing: role });
  };

  toggleRoleForPerson(role, personId, addRemove) {
    const { firestore, currentSong, currentSongId } = this.props;
    const roleArray = currentSong[role] || [];
    let newRoleArray;
    const adding = addRemove === "add";
    const removing = addRemove === "remove";
    if (removing) {
      console.log(`removing ${personId} from ${role}`);
      console.log("oldRoleArray", roleArray);
      newRoleArray = [...roleArray.filter(r => r !== personId)];
    } else if (adding) {
      console.log(`adding ${personId} to ${role}`);
      newRoleArray = [...roleArray, personId];
    }
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
  overwriteAlert = (
    <Container>
      <Alert
        color="danger"
        isOpen={this.state.showOverwriteAlert}
        className="text-center"
      >
        <Row>
          <Col>
            <p>Want to overwrite current personnel settings?</p>
          </Col>
        </Row>
        <hr className="my-0" />
        <Row>
          <Col>
            <Button color="primary" onClick={this.confirmOverwrite}>
              yes, overwrite
            </Button>
          </Col>
          <Col>
            <Button className="btn-simple" onClick={this.cancelSelectGroup}>
              cancel
            </Button>
          </Col>
        </Row>
      </Alert>
    </Container>
  );
  groupNameForm = (
    <Form onSubmit={this.onSubmit}>
      {({ handleSubmit, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <TextInput
            name="title"
            placeholder="group title"
            label="Group Title"
          />
        </form>
      )}
    </Form>
  );
  personnelTable() {
    const { account, groups } = this.props;
    const { peopleAttributeNames } = account;
    return (
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {groups && (
              <PersonnelGroupPicker
                handleSelectGroup={this.handleSelectGroup}
              />
            )}
            <Button onClick={this.openGroupNameForm}>Save This Group</Button>
          </Col>
          <Col xs={12} md={9}>
            {this.state.showOverwriteAlert && this.overwriteAlert}
            {this.state.showGroupNameForm && this.groupNameForm}
          </Col>
        </Row>
        <Row className="bg-light">
          {Object.keys(peopleAttributeNames).map(role => {
            return (
              <Col key={role} xs={12} sm={6} md={4} lg={3}>
                {this.roleCard(role)}
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
  roleCard = role => {
    const { currentSong, people } = this.props;
    const editing = this.state.editing === role;
    const peopleWithThisRole =
      currentSong[role] &&
      currentSong[role].map(personId => {
        const person = people[personId];
        if (!person) return null;
        return (
          <ListGroupItem
            key={personId}
            className="py-1 px-2  d-flex justify-content-between align-items-center"
          >
            <span
              className={classnames({
                "font-weight-bold": editing
              })}
            >
              {person.firstName} {person.lastName}
            </span>
            {editing && (
              <i
                className="far fa-minus-square text-danger"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.toggleRoleForPerson(role, personId, "remove")
                }
              />
            )}
          </ListGroupItem>
        );
      });
    const peopleWithoutThisRole = () => {
      const ids = Object.keys(people).filter(personId => {
        if (!currentSong[role]) return true;
        return !currentSong[role].includes(personId);
      });
      return ids.map(personId => {
        const person = people[personId];
        return (
          <ListGroupItem className="py-1 px-2  d-flex justify-content-between align-items-center">
            <span>
              {person.firstName} {person.lastName}
            </span>
            <i
              className="far fa-plus-square text-success"
              style={{ cursor: "pointer" }}
              onClick={() => this.toggleRoleForPerson(role, personId, "add")}
            />
          </ListGroupItem>
        );
      });
    };

    return (
      <Card className="mt-2">
        <CardHeader>
          <h6 className="text-muted">
            {pluralize(role, currentSong[role] && currentSong[role].length)}
          </h6>
        </CardHeader>
        <ListGroup action="true" flush>
          {peopleWithThisRole}
          {editing && peopleWithoutThisRole()}
        </ListGroup>
        <CardFooter className="p-1">
          {editing ? (
            <Button
              className="btn-info btn-link btn-block btn-sm"
              onClick={() => this.editThisRole("")}
            >
              done
            </Button>
          ) : (
            <Button
              className="btn-info btn-link btn-block btn-sm"
              onClick={() => this.editThisRole(role)}
            >
              edit
            </Button>
          )}
        </CardFooter>
      </Card>
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
      account
    ) {
      return this.personnelTable();
    } else {
      if (!groups) return <div>yo no groups</div>;
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
  groups: state.firestore.data.groups
});
export default compose(
  connect(mapState),
  firestoreConnect()
)(Personnel);
