import React, { Component } from "react";
import { Button } from "reactstrap";
import { Form } from "react-final-form";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
//
import LoadingSpinner from "./loadingSpinner.jsx";
import TextInput from "../forms/formComponents/textInput.jsx";
//
class GroupNameDisplay extends Component {
  state = {
    editingGroupName: false
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
  render() {
    const { currentGroup } = this.props;
    const { title, subTitle } = currentGroup || {};
    return (
      <div className="d-flex justify-content-start align-content-center ">
        {!this.state.editingGroupName ? (
          <div id="editGroupName">
            <h3 className="m-0">{title}</h3>
            <em>{subTitle}</em>
            <small className="d-block text-muted">
              <Button
                className="btn btn-link"
                size="sm"
                onClick={() => this.setState({ editingGroupName: true })}
              >
                change name
              </Button>
            </small>
            {this.state.savingGroupName && <LoadingSpinner />}
          </div>
        ) : (
          <div>
            <Form
              onSubmit={this.onSubmitNameChange}
              initialValues={{
                title: currentGroup.title,
                subTitle: currentGroup.subTitle
              }}
            >
              {({ values, handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <TextInput name="title" placeholder="Group Title" />
                    <TextInput name="subTitle" placeholder="Subtitle" />
                    <Button
                      size="sm"
                      className="mt-0"
                      color="warning"
                      onClick={() => this.setState({ editingGroupName: false })}
                    >
                      cancel
                    </Button>
                    <Button size="sm" className="mt-0" color="primary">
                      SAVE
                    </Button>
                  </form>
                );
              }}
            </Form>
          </div>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  currentGroupId: state.current.id,
  currentGroup: state.current.groups
});
export default compose(
  firestoreConnect(),
  connect(mapState)
)(GroupNameDisplay);
