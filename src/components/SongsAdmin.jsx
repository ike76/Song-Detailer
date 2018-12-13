import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardHeader, CardBody, Col, Row } from "reactstrap";
//
import LoadingSpinner from "./loadingSpinner";
import SelectorList from "./SelectorList.jsx";
import SongForm from "../forms/formComponents/SongForm.jsx";
import SongFormNav from "../forms/formComponents/SongFormNav";
export class SongsAdmin extends Component {
  songCard() {
    const { songs, currentSongId } = this.props;
    console.log("currentSongId", currentSongId);
    return (
      <Card>
        <CardHeader className="bg-light">
          <Row className="d-flex">
            <Col xs={12} md={4} className="order-md-1">
              <SelectorList
                key={currentSongId}
                listOptions={songs}
                currentOptionId={currentSongId}
                resourceType={"songs"}
                resourceSingular="song"
                formatter={song => song.title}
              />
            </Col>
            <Col xs={12} md={8} className="order-md-0">
              <SongFormNav />
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="d-flex justify-content-center " />
          <Row>
            <SongForm />
          </Row>
        </CardBody>
      </Card>
    );
  }
  render() {
    return this.props.songs && this.props.currentSongId ? (
      this.songCard()
    ) : (
      <LoadingSpinner />
    );
  }
}

const mapState = state => ({
  songs: state.firestore.data.songs,
  currentSongId: state.current.id
});
export default connect(mapState)(SongsAdmin);
