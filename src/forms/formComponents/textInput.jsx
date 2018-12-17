import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Input, Label, FormText } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
const TextInput = ({ name, label, placeholder }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const { touched, error } = meta;
        // console.log("my input", input);
        // console.log("my meta", meta);
        return (
          <FormGroup>
            {label && <Label>{label}</Label>}
            <Input
              {...input}
              placeholder={placeholder || label}
              className={classnames({
                "border-danger": touched && error
              })}
            />
            {touched && error && <FormText color="danger">{error}</FormText>}
          </FormGroup>
        );
      }}
    </Field>
  );
};
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired
};

export default TextInput;
