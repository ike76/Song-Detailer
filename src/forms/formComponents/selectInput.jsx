import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Input, Label } from "reactstrap";

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

export default SelectInput;
