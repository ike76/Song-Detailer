import React from "react";
import { FormGroup, Label } from "reactstrap";
import { CheckInput } from "../formComponents";
import LoadingSpinner from "../../components/loadingSpinner";

const CheckboxGroup = ({ options, label, ...props }) => {
  if (!options) return <LoadingSpinner />;
  return (
    <FormGroup tag="fieldset">
      <Label>
        {label}
        <button className=" btn-link">
          <small>ADD NEW</small>
          {/* TODO add thing from here */}
        </button>
      </Label>

      <div className="d-flex   align-items-center flex-wrap">
        {options.map(opt => {
          return <CheckInput key={opt.value} option={opt} {...props} />;
        })}
      </div>
    </FormGroup>
  );
};

export default CheckboxGroup;
