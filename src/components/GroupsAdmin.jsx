import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
//
import LoadingSpinner from "./loadingSpinner.jsx";
import GroupList from "./GroupList.jsx";
import GroupEditor from "../forms/formComponents/songFormPages/GroupEditor.jsx";
export class GroupsAdmin extends Component {
  state = {
    editingGroupName: false,
    savingGroupName: false
  };
  onSubmitNameChange = values => {
    this.setState({ savingGroupName: true });
    console.log("name change", values);
    const { firestore, currentGroupId } = this.props;
    firestore
      .update(
        {
          collection: "groups",
          doc: currentGroupId
        },
        values
      )
      .then(() =>
        this.setState({ editingGroupName: false, savingGroupName: false })
      );
  };
  // groupCard() {
  //   const { groups, currentGroupId } = this.props;
  //   return (
  //     <Card>
  //       <CardHeader className="bg-light p-1">
  //         <Row className="d-flex">
  //           <Col
  //             xs={12}
  //             md={4}
  //             className="order-md-1 d-flex justify-content-center align-items-center"
  //           >
  //             <SelectorList
  //               key={currentGroupId}
  //               listOptions={groups}
  //               currentOptionId={currentGroupId}
  //               resourceType={"groups"}
  //               resourceSingular="group"
  //               formatter={group => (
  //                 <span className="d-inline-block text-center text-uppercase ">
  //                   <p className="m-0">{group && group.title}</p>
  //                   <small>{group && group.subTitle}</small>
  //                 </span>
  //               )}
  //               buttonDropdown={true}
  //             />
  //           </Col>
  //           <Col xs={12} md={8} className="order-md-0">
  //             <GroupNameDisplay />
  //           </Col>
  //         </Row>
  //       </CardHeader>
  //       <CardBody>
  //         <Row className="d-flex justify-content-center " />
  //       </CardBody>
  //     </Card>
  //   );
  // }
  render() {
    const { groups, currentGroup, currentResourceType } = this.props;
    if (currentResourceType === "groups" && groups) {
      if (currentGroup !== "none") return <GroupEditor />;
      else {
        return <GroupList />;
      }
    } else return <LoadingSpinner />;
  }
}
const mapState = state => ({
  groups: state.firestore.data.groups,
  currentGroupId: state.current.id,
  currentGroup: state.current.groups,
  currentResourceType: state.current.resourceType
});
const mapDispatch = {};
export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firestoreConnect()
)(GroupsAdmin);
