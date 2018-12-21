import React from "react";
import styled from "styled-components";
export const showMe = (obj, name) => (
  <div>
    <small className="text-faded d-block">{name}</small>
    <small>
      <code className="text-muted">{JSON.stringify(obj, 0, 2)}</code>
    </small>
  </div>
);

export const formatGroup = group => {
  if (!group) return null;
  return (
    <div className="d-inline-block text-center text-uppercase ">
      <p className="m-0">
        <b>{group.title}</b>
      </p>
      <p className="m-0">
        <small style={{ position: "relative", top: "-5px" }} className="m-0">
          {group.subTitle}
        </small>
      </p>
    </div>
  );
};

export const StyledForm = styled.form`
  input::placeholder {
    color: #6c757d7a;
  }
`;

export const StyledGrid = styled.div`
${p =>
  p.show
    ? `
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12,
.col {
  border: 1px dashed #ff000029;
}
.row, .form-row {
  border: 1px dashed #00800073;

`
    : ""}
  }
`;
