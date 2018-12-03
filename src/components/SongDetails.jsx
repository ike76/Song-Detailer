import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Nav,
  NavLink,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";

// my stuff
import SongBasics from "../forms/SongBasics.jsx";

export class SongDetails extends Component {
  state = {
    index: 2
  };
  setCardIndex = index => () => {
    this.setState({ index });
  };
  render() {
    const tabs = [
      { name: "Basics", component: SongBasics },
      { name: "Vibes", component: SongBasics },
      { name: "Sounds", component: SongBasics },
      { name: "Topics", component: SongBasics }
    ];
    return (
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <Nav className="justify-content-center ">
                {tabs.map((tab, i) => {
                  const active = this.state.index === i;
                  return (
                    <NavLink
                      key={tab.name}
                      className={classnames({ active })}
                      onClick={this.setCardIndex(i)}
                    >
                      <Button color={active ? "primary" : ""}>
                        {tab.name}
                      </Button>
                    </NavLink>
                  );
                })}
              </Nav>
            </CardHeader>
            <CardBody>
              <SwipeableViews index={this.state.index}>
                {tabs.map(tab => (
                  <tab.component key={tab.name} />
                ))}
              </SwipeableViews>
            </CardBody>
          </Card>
        </Col>
        <Col />
      </Row>
    );
  }
}

export default SongDetails;
