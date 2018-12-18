import React, { Component } from "react";
import { Form } from "react-final-form";
import { Card, CardBody, Button } from "reactstrap";
import TextInput from "../../../forms/formComponents/textInput.jsx";
import { connect } from "react-redux";
export class NameThisGroup extends Component {
  onSubmit = ({ groupTitle, groupSubTitle }) => {
    const { saveThisGroup, updateName, currentGroup, cancel } = this.props;
    if (!currentGroup) {
      saveThisGroup({ title: groupTitle, subTitle: groupSubTitle });
    }
    if (currentGroup) {
      updateName({ title: groupTitle, subTitle: groupSubTitle });
    }
    cancel();
  };
  render() {
    const { cancel, groupsArr, currentGroup } = this.props;
    return (
      <Card>
        <CardBody>
          <Form
            onSubmit={this.onSubmit}
            initialValues={
              currentGroup && {
                groupTitle: currentGroup.title,
                groupSubTitle: currentGroup.subTitle
              }
            }
            validate={values => {
              const errors = {};
              if (!values.groupTitle)
                errors.groupTitle = "group title required";
              if (
                groupsArr.find(
                  g =>
                    g.title === values.groupTitle &&
                    g.subTitle === values.groupSubTitle
                )
              )
                errors.groupSubTitle = `${
                  values.groupSubTitle
                } has already been used`;
              return errors;
            }}
          >
            {({ handleSubmit, submitting, hasValidationErrors }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <TextInput name="groupTitle" label="Title" />
                  <TextInput name="groupSubTitle" label="Subtitle" />
                  <Button disabled={submitting || hasValidationErrors}>
                    save
                  </Button>
                  <Button onClick={cancel}>Cancel</Button>
                </form>
              );
            }}
          </Form>
        </CardBody>
      </Card>
    );
  }
}
const mapState = state => ({
  groupsArr: state.firestore.ordered.groups
});
export default connect(mapState)(NameThisGroup);
