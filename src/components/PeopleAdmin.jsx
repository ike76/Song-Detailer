import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { Card, CardHeader, CardBody, Col, Row } from "reactstrap";
//
import { showMe } from "../helpers";
import PeopleForm2 from "../forms/formComponents/PeopleForm2.jsx";
import LoadingSpinner from "./loadingSpinner";
import SelectorList from "./SelectorList.jsx";
//
//
export class PeopleAdmin extends Component {
  table = () => {
    const { peopleAttributeNames } = this.props.account;
    const { people, currentPersonId } = this.props;
    return (
      <>
        {showMe(peopleAttributeNames, "peopleAttributeNames")}
        {showMe(this.props.currentPerson, "current person")}

        <Card>
          <CardHeader>
            <Row>
              <Col xs={6}>
                <h3>People</h3>
              </Col>
              <Col xs={6}>
                <SelectorList
                  listOptions={people}
                  currentOptionId={currentPersonId}
                  resourceType={"people"}
                  resourceSingular={"person"}
                  formatter={person =>
                    person && person.firstName + " " + person.lastName
                  }
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <PeopleForm2 />
          </CardBody>
        </Card>
      </>
    );
  };
  render() {
    const { account, people, currentResourceType } = this.props;
    return account && people && currentResourceType === "people" ? (
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
  currentPersonId: state.current.personId,
  currentResourceType: state.current.resourceType
});
export default connect(mapState)(PeopleAdmin);
