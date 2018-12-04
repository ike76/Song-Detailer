import React, { Component } from "react";
import { Button } from "reactstrap";
export class ImageUploader extends Component {
  state = {
    modalOpen: true
  };
  render() {
    return (
      <div>
        <Button>Add new</Button>
      </div>
    );
  }
}

export default ImageUploader;
