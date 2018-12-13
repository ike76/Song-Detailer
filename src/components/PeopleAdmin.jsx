import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { Card, CardHeader, CardBody, Col, Row } from "reactstrap";
//
import { showMe } from "../helpers";
import PeopleForm from "../forms/formComponents/PeopleForm.jsx";
import LoadingSpinner from "./loadingSpinner";
import SelectorList from "./SelectorList.jsx";
//
//
export class PeopleAdmin extends Component {
  componentDidMount() {}

  table = () => {
    const { peopleAttributeNames } = this.props.account;
    const { people, currentPersonId } = this.props;
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
              <Col xs={12} md={3}>
                <SelectorList
                  listOptions={people}
                  currentOptionId={currentPersonId}
                  resourceType={"people"}
                  resourceSingular={"person"}
                  formatter={person => person.firstName + " " + person.lastName}
                />
              </Col>
              <Col xs={12} md={9}>
                <PeopleForm />
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
