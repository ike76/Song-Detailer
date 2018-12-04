import React, { Component } from "react";
import { connect } from "react-redux";
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
import SongSwitcher from "./SongSwitcher.jsx";
import { getAllSongs } from "../actions/songActions";
import { getAllPeople } from "../actions/peopleActions";

export class SongDetails extends Component {
  state = {
    index: 0
  };
  componentDidMount() {
    const { getAllPeople, getAllSongs } = this.props;
    getAllPeople();
    getAllSongs();
  }
  setCardIndex = index => () => {
    this.setState({ index });
  };
  render() {
    const tabs = [
      { name: "Basics", component: SongBasics },
      { name: "Vibes", component: () => <div>yo</div> },
      { name: "Sounds", component: () => <div>yo</div> },
      { name: "Topics", component: () => <div>yo</div> }
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
                <SongSwitcher />
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
const mapState = state => ({
  allSongs: state.songs.allSongs,
  allPeople: state.people.allPeople
});
const mapDispatch = { getAllPeople, getAllSongs };
export default connect(
  mapState,
  mapDispatch
)(SongDetails);
