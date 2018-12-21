import React from "react";
import { Button } from "reactstrap";
const CloudinaryWidget = () => {
  const widget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "homecomp"
        //   uploadPreset: "preset1"
      },
      (error, result) => {
        console.log("result", result);
      }
    );
  };
  return (
    <div>
      <Button onClick={widget.open}>open</Button>
    </div>
  );
};

export default CloudinaryWidget;
