import React, { Component } from "react";
import { Field } from "react-final-form";
import { FormGroup, Label, Input } from "reactstrap";
import CheckboxGroup from "./checkboxGroup.jsx";
export class RolePersonSelector extends Component {
  render() {
    const { role } = this.props;
    return (
      <Field name={role}>
        {({ input }) => {
          return <Input {...input} type="text" />;
        }}
      </Field>
    );
  }
}

export default RolePersonSelector;
