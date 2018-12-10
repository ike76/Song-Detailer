import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center  h-100 w-100"
      style={{ background: "#dcdcdc54" }}
    >
      <i className="fas fa-spinner fa-spin fa-2x" />
    </div>
  );
};

export default LoadingSpinner;
