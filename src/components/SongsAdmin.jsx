import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
//
import LoadingSpinner from "./loadingSpinner";
import SelectorList from "./SelectorList.jsx";
import SongForm from "../forms/formComponents/SongForm.jsx";
import SongFormNav from "../forms/formComponents/SongFormNav";
import { showMe } from "../helpers";

export class SongsAdmin extends Component {
  state = { songFormPage: 0 };
  setSongFormPage = index => {
    this.setState({ songFormPage: index });
  };
  songCard() {
    const { songs, currentSongId } = this.props;
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
                formatter={song => song && song.title}
              />
            </Col>
            <Col xs={12} md={8} className="order-md-0">
              <SongFormNav
                setSongFormPage={this.setSongFormPage}
                currentPage={this.state.songFormPage}
                songUnsaved={currentSongId === "new"}
              />
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="d-flex justify-content-center " />
          <Row>
            <SongForm page={this.state.songFormPage} />
          </Row>
        </CardBody>
      </Card>
    );
  }
  songList() {
    const { songs, currentSongId, groups } = this.props;
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
                formatter={song => song && song.title}
              />
            </Col>
            <Col xs={12} md={8} className="order-md-0">
              <Link to="/admin/songs/new">
                <Button>Add New Song</Button>
              </Link>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <ListGroup flush>
                {Object.keys(songs).map(songId => {
                  const song = songs[songId];
                  if (!song) return null;
                  return (
                    <ListGroupItem action>
                      <Link
                        key={songId}
                        to={`/admin/songs/${songId}`}
                        className="text-secondary"
                      >
                        <strong className="text-uppercase">{song.title}</strong>
                      </Link>

                      {groups && groups[song.groupId] && (
                        <div className="text-muted text-uppercase d-inline">
                          {"  "}•{"  "}
                          <Link to={`/admin/groups/${song.groupId}`}>
                            <span>{groups[song.groupId].title}</span>{" "}
                            <span className="font-weight-light">
                              {groups[song.groupId].subTitle}
                            </span>
                          </Link>
                        </div>
                      )}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
              {/* {showMe(songs, "songs")} */}
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
  render() {
    const { songs, currentSongId, currentResourceType } = this.props;
    if (songs && currentSongId && currentResourceType === "songs") {
      if (currentSongId === "none") return this.songList();
      return this.songCard();
    } else {
      return <LoadingSpinner />;
    }
  }
}

const mapState = state => ({
  songs: state.firestore.data.songs,
  currentSongId: state.current.id,
  currentResourceType: state.current.resourceType,
  groups: state.firestore.data.groups
});
export default connect(mapState)(SongsAdmin);
