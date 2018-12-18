import React, { Component } from "react";
import {
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container
} from "reactstrap";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import pluralize from "pluralize";
import classnames from "classnames";
//
import LoadingSpinner from "../../../components/loadingSpinner.jsx";
import PersonnelGroupPicker from "./PersonnelGroupPicker.jsx";
import WhiteOut from "../../../components/Modals/WhiteOut.jsx";
import {
  openWhiteout,
  closeWhiteout,
  setCurrent
} from "../../../actions/currentActions";
import { formatGroup } from "../../../helpers";

//
//

export class GroupEditor extends Component {
  state = {
    editing: "",
    pendingGroup: "",
    title: "",
    subTitle: "",
    currentGroup: {}
  };
  componentDidUpdate(prevProps) {
    if (this.props.currentGroupId === "none") this.noGroupSelected();
  }
  componentDidMount() {
    if (this.props.currentGroupId === "none") this.noGroupSelected();
  }
  noGroupSelected() {
    // const { openWhiteout } = this.props;
    // const { handleSelectGroup, handleNameGroup } = this;
    // openWhiteout("noGroupSelected", {
    //   handleSelectGroup,
    //   handleNameGroup,
    //   noBackgroundCancel: true
    // });
    console.log("no group selected called");
  }

  handleNameGroup = currentGroup => {
    const { openWhiteout, groups } = this.props;
    openWhiteout("nameThisGroup", {
      currentGroup, // currentGroup is undefined if this is a new group
      saveThisGroup: this.saveThisGroup, // this gets called if new group
      updateName: this.updateName // this gets called if currentGroup exists (update)
    });
  };
  updateName = values => {
    const { firestore, currentGroupId } = this.props;
    firestore.update(
      {
        collection: "groups",
        doc: currentGroupId
      },
      values
    );
  };
  saveThisGroup = ({ title, subTitle }) => {
    const { currentGroup, account, firestore, firebase, history } = this.props;
    const { peopleAttributeNames } = account;
    const newGroup = Object.keys(peopleAttributeNames).reduce((obj, attr) => {
      obj[attr] = currentGroup[attr] || [];
      return obj;
    }, {});
    firestore
      .add(
        {
          collection: "groups"
        },
        {
          ...newGroup,
          adminId: firebase.auth().currentUser.uid,
          title: title,
          subTitle: subTitle
        }
      )
      .then(({ id }) => {
        history.push(`/admin/groups/${id}`);
      });
  };
  handleDeleteGroup = () => {
    const { openWhiteout, currentGroup } = this.props;
    const message = (
      <div>
        <h6 className="mb-0 text-muted">
          Are You Sure you want to <b>DELETE</b>
        </h6>
        <p className="mb-0" />
        <h3 className="text-uppercase mb-1">{currentGroup.title}</h3>
        <h6 className="text-uppercase">{currentGroup.subTitle} ?</h6>
        <Button className="btn-danger" onClick={this.deleteGroup}>
          Delete
        </Button>
        <Button
          className="btn-outline-primary"
          onClick={this.props.closeWhiteout}
        >
          Cancel
        </Button>
      </div>
    );
    openWhiteout("areYouSure", { message });
  };
  deleteGroup = () => {
    const { firestore, currentGroupId, history } = this.props;
    firestore
      .update({ collection: "groups", doc: currentGroupId }, { adminId: null })
      .then(() => history.push("/admin/groups"));
  };
  handleSelectGroup = groupId => {
    const { history, closeWhiteout } = this.props;
    console.log("editing", groupId);
    history.push(`/admin/groups/${groupId}`);
    closeWhiteout();
  };

  confirmOverwrite = () => {
    const {
      groups,
      account,
      firestore,
      closeWhiteout,
      currentGroupId
    } = this.props;
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
          doc: currentGroupId
        },
        updateObj
      )
      .then(response => {
        closeWhiteout();
      });
  };

  editThisRole = role => {
    this.setState({ editing: role });
  };

  toggleRoleForPerson(role, personId, addRemove) {
    const { firestore, currentGroup, currentGroupId } = this.props;
    const roleArray = currentGroup[role] || [];
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
        collection: "groups",
        doc: currentGroupId
      },
      {
        [role]: newRoleArray
      }
    );
  }
  selectOrNew = (
    <Card>
      <CardBody className="text-center">
        <PersonnelGroupPicker
          groupId={"none"}
          handleSelectGroup={this.handleSelectGroup}
        />
        <div>or</div>
        <Button onClick={this.handleNameGroup}>Create New Group</Button>
      </CardBody>
    </Card>
  );
  groupDisplay = groupId => {
    const group = this.props.groups[groupId];
    return groupId;
  };
  showAllGroups = () => {
    const { groups, history } = this.props;
    return (
      <>
        {groups &&
          Object.keys(groups).map(groupId => {
            const group = groups[groupId];
            return (
              <Col xs={6} md={4} lg={3} className="text-center">
                <Button
                  onClick={() => history.push(`/admin/groups/${groupId}`)}
                  className="btn-link btn-lg p-2"
                >
                  {formatGroup(group)}
                </Button>
              </Col>
            );
          })}
        <Col xs={6} md={4} lg={3} className="text-center">
          <Button
            onClick={this.handleNameGroup}
            className="btn-outline-primary btn-lg p-2"
          >
            New Group
          </Button>
        </Col>
      </>
    );
  };

  personnelTable() {
    const { account, groups, currentGroup, currentGroupId } = this.props;
    const { peopleAttributeNames } = account;
    const noGroupSelected = currentGroupId === "none";
    return (
      <div style={{ position: "relative" }}>
        <Container>
          <WhiteOut>
            <Row className="p-2">
              <Col xs={12} md={8} className="text-center">
                <h3 className="mb-0">
                  <b>{currentGroup.title}</b>{" "}
                  <em class="text-muted">{currentGroup.subTitle}</em>
                </h3>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleNameGroup(currentGroup)}
                >
                  <small text-muted>change name</small>{" "}
                  <i className="fa fa-edit ml-1" />
                </span>
              </Col>
              <Col xs={12} md={4}>
                {groups && (
                  <div className="d-flex justify-content-end">
                    <PersonnelGroupPicker
                      groupId={currentGroupId}
                      handleSelectGroup={this.handleSelectGroup}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <Row className="bg-light">
              {noGroupSelected
                ? this.showAllGroups()
                : Object.keys(peopleAttributeNames).map(role => {
                    return (
                      <Col key={role} xs={12} sm={6} md={4} lg={3}>
                        {this.roleCard(role)}
                      </Col>
                    );
                  })}
            </Row>
            <Row className="d-flex justify-content-end">
              <Button
                onClick={this.handleDeleteGroup}
                className="btn-round btn-icon"
                color="danger"
              >
                <i className="far fa-trash-alt" />
              </Button>
            </Row>
          </WhiteOut>
        </Container>
      </div>
    );
  }
  roleCard = role => {
    const { currentGroup, people } = this.props;
    const editing = this.state.editing === role;
    const peopleWithThisRole =
      currentGroup[role] &&
      currentGroup[role].map(personId => {
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
        if (!currentGroup[role]) return true;
        return !currentGroup[role].includes(personId);
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
            {pluralize(role, currentGroup[role] && currentGroup[role].length)}
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
    const { people, account, groups, currentGroupId } = this.props;
    if (people && account && groups) {
      return this.personnelTable();
    } else {
      if (!groups) return <div>yo no groups</div>;
      return <LoadingSpinner />;
    }
  }
}

const mapState = state => ({
  people: state.firestore.data.people,
  account: state.firestore.ordered.accounts[0],
  groups: state.firestore.data.groups,
  currentGroup: state.current.groups,
  currentGroupId: state.current.id
});
const mapDispatch = {
  openWhiteout,
  closeWhiteout,
  setCurrent
};
export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firestoreConnect(),
  withRouter
)(GroupEditor);
