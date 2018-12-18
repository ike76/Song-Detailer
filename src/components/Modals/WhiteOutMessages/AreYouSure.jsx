import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
const AreYouSure = ({ cancel, message }) => {
  return (
    <Card>
      <CardBody className="text-center">
        <Row>
          <Col
            xs={2}
            className="p-0 d-flex justify-content-center align-items-center "
            style={{ opacity: ".2", transform: "scale(1.7)" }}
          >
            <i class="far fa-question-circle text-warning display-1" />
          </Col>
          <Col xs={10} className="p-0">
            {message}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AreYouSure;
