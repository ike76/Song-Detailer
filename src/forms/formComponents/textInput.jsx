import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Input, Label, FormText } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import "@gouch/to-title-case";

const TextInput = ({ name, label, placeholder, titleCase }) => {
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
              value={titleCase ? input.value.toTitleCase() : input.value}
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
