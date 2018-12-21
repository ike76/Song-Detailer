import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { withRouter } from "react-router-dom";
const GroupOrCustom = ({
  cancel,
  currentSong,
  group,
  history,
  songsUsingThisGroup,
  convertToCustomGroup
}) => {
  const { groupId, title } = currentSong;
  return (
    <Card>
      <CardBody>
        <Row>
          <Col className="text-center">
            <p>
              <b className="text-uppercase">
                <u>{title}</u>
              </b>
              <br /> is using settings from the group: <br />{" "}
              <b className="text-uppercase">
                {group.title}{" "}
                <span className="text-muted">{group.subTitle}</span>
              </b>
              .
            </p>
            <p>You can either:</p>
          </Col>
        </Row>
        <Row>
          <Col className="border rounded text-center m-2">
            <Button
              onClick={() => {
                history.push(`/admin/groups/${groupId}`);
                cancel();
              }}
            >
              EDIT GROUP
            </Button>
            <p>
              ...which will also affect these songs:
              <ListGroup>
                {songsUsingThisGroup.map(song => {
                  return (
                    <ListGroupItem key={song.title} className="p-0" action>
                      {song.title}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </p>
          </Col>
          <Col className="border rounded text-center m-2">
            <Button
              onClick={() => {
                convertToCustomGroup();
                cancel();
              }}
            >
              USE CUSTOM SETTINGS
            </Button>
            <p>
              ...which can be saved as a <em>NEW GROUP</em> if you want
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-right">
            <Button className="btn-link btn-info" onClick={cancel}>
              cancel
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default withRouter(GroupOrCustom);
