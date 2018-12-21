import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Label, FormText } from "reactstrap";
import ReactDatetime from "react-datetime";
import Moment from "moment";
const DateInput = ({ name, label, viewMode, ...props }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const momentInput = { ...input, value: Moment(input.value) };
        const { touched, error } = meta;
        return (
          <FormGroup>
            <Label for={name}>{label}</Label>
            <ReactDatetime
              dateFormat="MMM D, YYYY"
              timeFormat={false}
              viewMode={viewMode || "months"}
              {...props}
              {...momentInput}
            />
            {touched && error && <FormText color="danger">{error}</FormText>}
          </FormGroup>
        );
      }}
    </Field>
  );
};

export default DateInput;
