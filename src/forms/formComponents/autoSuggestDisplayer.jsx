import React from "react";
import { Badge } from "reactstrap";
import styled from "styled-components";
//
const TagBadge = styled.div`
  display: inline-block;
  margin: 3px;
  transition: 0.3s all;
  .badge:hover {
    border: 1px red solid;
    cursor: pointer;
  }
`;

const AutoSuggestDisplayer = ({ tags }) => {
  return tags.map(val => (
    <TagBadge key={val}>
      <Badge onClick={() => this.removeTag(val)} className="badge badge-info">
        {val}
      </Badge>
    </TagBadge>
  ));
};
export default AutoSuggestDisplayer;
