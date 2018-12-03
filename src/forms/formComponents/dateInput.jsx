import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Label } from "reactstrap";
import ReactDatetime from "react-datetime";

const DateInput = ({ name, label, viewMode }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <FormGroup>
            <Label for={name}>{label}</Label>
            <ReactDatetime
              dateFormat="MMM D, YYYY"
              timeFormat={false}
              viewMode={viewMode}
              {...input}
            />
          </FormGroup>
        );
      }}
    </Field>
  );
};

export default DateInput;
