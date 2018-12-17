import React from "react";
import { Card, CardBody, CardText, CardSubtitle, CardLink } from "reactstrap";
import pluralize from "pluralize";
const PersonnelGroupCard = ({ peopleList, roleName }) => {
  return (
    <div className="mb-1">
      <h6 className="mb-0 text-muted">
        <small>{pluralize(roleName, peopleList.length)}</small>
      </h6>
      {peopleList.map((person, i) => (
        <span>
          {i > 0 ? ", " : ""}
          {person.firstName} {person.lastName}
        </span>
      ))}
    </div>
  );
};

export default PersonnelGroupCard;
