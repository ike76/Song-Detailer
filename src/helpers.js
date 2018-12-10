import React from "react";

export const showMe = (obj, name) => (
  <div>
    <small className="text-faded d-block">{name}</small>
    <code>{JSON.stringify(obj, 0, 2)}</code>
  </div>
);
