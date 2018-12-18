import React from "react";

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

// export const alphabetize = arrayOfPersonIds => {
//   return arrayOfPersonIds.sort((a, b) => a.lastName - b.lastName);
// };
