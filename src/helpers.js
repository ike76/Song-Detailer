import React from "react";

export const showMe = (obj, name) => (
  <div>
    <small className="text-faded d-block">{name}</small>
    <small>
      <code className="text-muted">{JSON.stringify(obj, 0, 2)}</code>
    </small>
  </div>
);

// export const alphabetize = arrayOfPersonIds => {
//   return arrayOfPersonIds.sort((a, b) => a.lastName - b.lastName);
// };
