import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Input, Label } from "reactstrap";
import PropTypes from "prop-types";
const SelectInput = ({ name, label, options }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <FormGroup>
            <Label for={name}>{label}</Label>
            <Input {...input} type="select" name={name} id={name}>
              {options.map(opt => (
                <option value={opt.value} key={opt.value}>
                  {opt.display}
                </option>
              ))}
            </Input>
          </FormGroup>
        );
      }}
    </Field>
  );
};
SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
};

export default SelectInput;
