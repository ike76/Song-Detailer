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
import { openWhiteout, closeWhiteout } from "../../../actions/currentActions";
export class Personnel extends Component {
  state = {
    editing: "",
    pendingGroup: "",
    title: "",
    subTitle: "",
    currentGroup: {}
  };
  handleNameGroup = () => {
    const { openWhiteout, groups } = this.props;
    openWhiteout("nameThisGroup", { saveThisGroup: this.saveThisGroup });
  };

  handleSelectGroup = groupId => {
    const { openWhiteout, groups } = this.props;
    const group = groups[groupId];

    this.setState({ pendingGroup: groupId });
    openWhiteout("overwriteWithGroup", {
      confirm: this.confirmOverwrite,
      group
    });
  };

  confirmOverwrite = () => {
    const { currentSongId, account, firestore, closeWhiteout } = this.props;
    const { peopleAttributeNames } = account;
    const groupId = this.state.pendingGroup;
    const updateObj = Object.keys(peopleAttributeNames).reduce((obj, role) => {
      obj[role] = { groupId };
      return obj;
    }, {});
    updateObj.groupId = groupId;
    // const updateObj = Object.keys(peopleAttributeNames).reduce((obj, role) => {
    //   obj[role] = group[role];
    //   return obj;
    // }, {});
    firestore
      .update(
        {
          collection: "songs",
          doc: currentSongId
        },
        updateObj
      )
      .then(response => {
        closeWhiteout();
      });
    // console.log("pplAttributeNames", peopleAttributeNames);
    // console.log("currentSong", currentSong);
    // console.log("group", group);
    // console.log("update obj", updateObj);
  };
  openGroupNameForm = () => {
    this.setState({ showGroupNameForm: true });
  };

  saveThisGroup = ({ title, subTitle }) => {
    const { currentSong, account, firestore, firebase } = this.props;
    const { peopleAttributeNames } = account;
    const newGroup = Object.keys(peopleAttributeNames).reduce((obj, attr) => {
      obj[attr] = currentSong[attr] || [];
      return obj;
    }, {});
    newGroup.title = title;
    newGroup.subTitle = subTitle;
    newGroup.adminId = firebase.auth().currentUser.uid;
    console.log("newGroup", newGroup);
    firestore
      .add(
        {
          collection: "groups"
        },
        newGroup
      )
      .then(({ id }) => {
        this.setState({ pendingGroup: id }, () => {
          this.confirmOverwrite();
        });
      });
  };
  editThisRole = role => {
    this.setState({ editing: role });
  };
  handleEditOnGroupControlled = role => {
    const { openWhiteout, currentSong, groups, songsArr } = this.props;
    const songsUsingThisGroup = songsArr.filter(
      s => s.groupId === currentSong.groupId
    );
    if (songsUsingThisGroup.length === 1) {
      return console.log("youre it");
    }
    const group = groups[currentSong.groupId];
    if (currentSong.groupId === "custom") return null;
    openWhiteout("groupOrCustom", { currentSong, group, songsUsingThisGroup });
  };

  toggleRoleForPerson(role, personId, addRemove) {
    const { firestore, currentSong, currentSongId } = this.props;
    const roleArray = currentSong[role] || [];
    let newRoleArray;
    const adding = addRemove === "add";
    const removing = addRemove === "remove";
    if (removing) {
      newRoleArray = [...roleArray.filter(r => r !== personId)];
    } else if (adding) {
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
  // groupNameForm = (
  //   <Form onSubmit={this.onSubmit}>
  //     {({ handleSubmit, pristine, values }) => (
  //       <form onSubmit={handleSubmit}>
  //         <TextInput
  //           name="title"
  //           placeholder="group title"
  //           label="Group Title"
  //         />
  //       </form>
  //     )}
  //   </Form>
  // );
  personnelTable() {
    const { account, groups, currentSong } = this.props;
    const { peopleAttributeNames } = account;
    return (
      <Container>
        <Row className="bg-light">
          {Object.keys(peopleAttributeNames).map(role => {
            return (
              <Col key={role} xs={12} sm={6} md={4} lg={3}>
                {this.roleCard(role)}
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col xs={12} md={3} className="text-center">
            {groups && (
              <PersonnelGroupPicker
                handleSelectGroup={this.handleSelectGroup}
              />
            )}
          </Col>
          <Col
            xs={12}
            md={6}
            className="justify-content-center d-flex align-content-center-center"
          >
            {currentSong.groupId && currentSong.groupId !== "custom" ? (
              <div>
                <b className="text-uppercase">
                  {groups[currentSong.groupId].title}
                </b>{" "}
                <span className="text-muted text-uppercase">
                  {groups[currentSong.groupId].subTitle}
                </span>
              </div>
            ) : (
              "CUSTOM SETTINGS"
            )}
          </Col>
          <Col xs={12} md={3} className="text-center">
            <Button onClick={this.handleNameGroup} className="m-0">
              Save This Group
            </Button>
            {/* {this.overwriteAlert} */}
            {/* {this.state.showGroupNameForm && this.groupNameForm} */}
          </Col>
        </Row>
      </Container>
    );
  }

  roleCard = role => {
    const { currentSong, people, groups } = this.props;
    const editing = this.state.editing === role;
    const songRole = currentSong[role] || [];
    const groupControlled =
      currentSong.groupId && currentSong.groupId !== "custom";
    let currentRoleList;
    if (groupControlled) {
      currentRoleList = groups[currentSong.groupId][role];
    } else {
      currentRoleList = songRole;
    }
    const peopleWithThisRole =
      currentRoleList &&
      currentRoleList.map(personId => {
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
        return !currentRoleList.includes(personId);
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
            {pluralize(role, currentRoleList && currentRoleList.length)}
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
              onClick={() => {
                groupControlled
                  ? this.handleEditOnGroupControlled(role)
                  : this.editThisRole(role);
              }}
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
  groups: state.firestore.data.groups,
  songsArr: state.firestore.ordered.songs
});
const mapDispatch = {
  openWhiteout,
  closeWhiteout
};
export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firestoreConnect()
)(Personnel);
