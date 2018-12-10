import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { Link } from "react-router-dom";
//
import { showMe } from "../helpers";
import StakeHoldersForm from "../forms/formComponents/StakeHoldersForm.jsx";
import LoadingSpinner from "./loadingSpinner";
//
//
export class PeopleAdmin extends Component {
  // state = {
  //   currentPerson: null,
  //   currentPersonIndex: null
  // };
  // setCurrentPerson = (currentPerson, currentPersonIndex) => {
  //   this.setState({ currentPerson, currentPersonIndex });
  // };
  componentDidUpdate(prevProps) {
    if (this.props.people && !prevProps.people) {
      const firstPersonId = Object.keys(this.props.people)[0];
      const requestedPersonId = this.props.personId;
      const currentPersonId = requestedPersonId || firstPersonId;
      const currentPerson = this.props.people[currentPersonId];
      // this.setCurrentPerson({ ...currentPerson, id: currentPersonId }, 0);
    }
  }
  componentDidMount() {
    if (this.props.people) {
      const firstPersonId = Object.keys(this.props.people)[0];
      const requestedPersonId = this.props.personId;
      const currentPersonId = requestedPersonId || firstPersonId;
      const currentPerson = this.props.people[currentPersonId];
      // this.setCurrentPerson({ ...currentPerson, id: currentPersonId }, 0);
    }
  }

  table = () => {
    const { peopleAttributeNames } = this.props.account;
    const { people } = this.props;
    return (
      <>
        {showMe(peopleAttributeNames, "peopleAttributeNames")}
        {showMe(this.props.currentPerson, "current person")}

        <Card>
          <CardHeader>
            <h3>People</h3>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs={4} sm={3}>
                <ListGroup flush>
                  {Object.keys(people).map((key, i) => {
                    const person = people[key];
                    return !person ? null : (
                      <Link to={`/admin/people/${key}`}>
                        <ListGroupItem
                          key={key}
                          action
                          active={this.props.currentPersonId === key}
                          // onClick={() =>
                          //   this.setCurrentPerson({ ...person, id: key }, i)
                          // }
                          // tag="button"
                        >
                          <span className="d-none d-sm-inline">
                            {person.firstName + " " + person.lastName}
                          </span>
                          <span className="d-inline d-sm-none">
                            {person.firstName[0] + ". " + person.lastName}
                          </span>
                        </ListGroupItem>
                      </Link>
                    );
                  })}
                  <Link to="/admin/people/new">
                    <ListGroupItem
                      action
                      active={this.props.currentPersonId === "new"}
                    >
                      * Add Person *
                    </ListGroupItem>
                  </Link>
                </ListGroup>
              </Col>
              <Col xs={8} sm={9}>
                <StakeHoldersForm />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  };
  render() {
    const { account, people } = this.props;
    return account && people ? (
      this.table()
    ) : (
      <>
        <LoadingSpinner />
        <p>wait for it . . .</p>
      </>
    );
  }
}
const mapState = state => ({
  people: state.firestore.data.people,
  account:
    state.firestore.data.accounts &&
    firebase.auth().currentUser &&
    state.firestore.data.accounts[firebase.auth().currentUser.uid],
  currentPerson: state.current.person,
  currentPersonId: state.current.personId
});
export default connect(mapState)(PeopleAdmin);
