import React from "react";
import { Button, Card, CardHeader, CardBody, CardFooter } from "reactstrap";
const OverwriteWithGroup = ({ cancel, group, confirm }) => {
  return (
    <Card>
      <CardHeader>
        Do you want to overwrite current personnel settings with the settings
        from:
      </CardHeader>
      <CardBody>
        <div className="text-center text-uppercase">
          <strong>{group.title}</strong>
          <p>{group.subTitle}</p>
        </div>
      </CardBody>
      <CardFooter>
        <div className="d-flex justify-content-around">
          <Button outline color="warning" onClick={cancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={confirm}>
            Confirm
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OverwriteWithGroup;
