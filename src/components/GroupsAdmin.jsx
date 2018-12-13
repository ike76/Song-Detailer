import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap";
//
import SelectorList from "./SelectorList.jsx";
import LoadingSpinner from "./loadingSpinner.jsx";
import GroupForm from "../forms/formComponents/GroupForm.jsx";
export class GroupsAdmin extends Component {
  groupCard() {
    const { groups, currentGroupId } = this.props;
    return (
      <Card>
        <CardHeader className="bg-light p-1">
          <Row className="d-flex">
            <Col xs={12} md={4} className="order-md-1">
              <SelectorList
                key={currentGroupId}
                listOptions={groups}
                currentOptionId={currentGroupId}
                resourceType={"groups"}
                resourceSingular="group"
                formatter={group => group.title}
              />
            </Col>
            <Col xs={12} md={8} className="order-md-0">
              <div className="d-flex justify-content-start align-content-center ">
                <div>
                  <h3 className="m-0">Led Zeppelin</h3>
                  <em>Featuring Guy Smiley</em>
                </div>
                <Button size="sm" className="btn btn-link">
                  change
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="d-flex justify-content-center " />
          <GroupForm />
        </CardBody>
      </Card>
    );
  }
  render() {
    return this.props.groups && this.props.currentGroupId ? (
      this.groupCard()
    ) : (
      <LoadingSpinner />
    );
  }
}
const mapState = state => ({
  groups: state.firestore.data.groups,
  currentGroupId: state.current.id
});
const mapDispatch = {};
export default compose(
  connect(
    mapState,
    mapDispatch
  )
  //   firestoreConnect()
)(GroupsAdmin);
