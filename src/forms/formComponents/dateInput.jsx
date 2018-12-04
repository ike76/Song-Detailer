import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Label } from "reactstrap";
import ReactDatetime from "react-datetime";
import Moment from "moment";
const DateInput = ({ name, label, viewMode }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const momentInput = { ...input, value: Moment(input.value) };
        return (
          <FormGroup>
            <Label for={name}>{label}</Label>
            <ReactDatetime
              dateFormat="MMM D, YYYY"
              timeFormat={false}
              viewMode={viewMode}
              {...momentInput}
            />
          </FormGroup>
        );
      }}
    </Field>
  );
};

export default DateInput;
