import React from "react";
import { Field } from "react-final-form";
import { FormGroup, Input, Label } from "reactstrap";
import classnames from "classnames";

const CheckInput = ({ name, option }) => {
  return (
    <Field name={name} value={option.value} type="checkbox">
      {({ input, meta }) => {
        return (
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Label check>
                <Input {...input} type="checkbox" />
                <span className="form-check-sign">
                  <span className="check" />
                </span>
                <span
                  className={classnames("h6 mr-3", {
                    "text-dark": input.checked
                  })}
                >
                  {option.display}
                </span>
              </Label>
            </FormGroup>
          </FormGroup>
        );
      }}
    </Field>
  );
};

export default CheckInput;
