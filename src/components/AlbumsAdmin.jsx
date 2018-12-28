import React, { Component } from "react";
import {
  ListGroupItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ListGroup,
  Button,
  Row,
  Col
} from "reactstrap";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import LoadingSpinner from "./loadingSpinner";
//
import TextInput from "../forms/formComponents/textInput.jsx";
import { StyledForm } from "../helpers";
export class AlbumsAdmin extends Component {
  state = {
    editing: "",
    newTitle: ""
    // tooltipOpen: null
  };
  //   tooltipToggle = albumId => {
  //     this.setState({ tooltipOpen: this.state.tooltipOpen ? null : albumId });
  //   };
  editThisAlbum = albumId => {
    this.setState({ editing: albumId });
  };
  deleteThisAlbum = albumId => {
    const { firestore } = this.props;
    firestore.delete({
      collection: "albums",
      doc: albumId
    });
  };
  removeAllSongs = albumId => {
    const { firestore } = this.props;
    firestore.update(
      {
        collection: "albums",
        doc: albumId
      },
      {
        albumSongs: []
      }
    );
  };
  addThisSongToAlbum = (songId, albumId) => {
    const { albums } = this.props;
    const oldSongsArr = albums[albumId].albumSongs || [];
    const albumSongs = [...oldSongsArr, songId];
    this.updateFirestore(albumId, { albumSongs });
  };
  removeThisSongFromAlbum = (songId, albumId) => {
    const { albums } = this.props;
    const oldSongsArr = albums[albumId].albumSongs || [];
    const albumSongs = oldSongsArr.filter(sId => sId !== songId);
    this.updateFirestore(albumId, { albumSongs });
  };
  createNewAlbum = _values => {
    const { firestore, firebase } = this.props;
    const { albumTitle, albumSubtitle } = _values;
    const values = {
      title: albumTitle || "",
      subtitle: albumSubtitle || "",
      adminId: firebase.auth().currentUser.uid,
      albumSongs: []
    };
    console.log("create new - values", values);
    firestore
      .add(
        {
          collection: "albums"
        },
        values
      )
      .then(({ id }) => {
        console.log("id", id);
      });
  };
  updateFirestore = (albumId, update) => {
    const { firestore } = this.props;
    firestore.update(
      {
        collection: "albums",
        doc: albumId
      },
      update
    );
  };
  cardColumnSizes = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3
  };
  albumCard = (album, albumId) => {
    if (!album || !albumId) return null;
    const { songs, groups } = this.props;
    const editing = this.state.editing === albumId;

    const songsOnThisAlbum =
      album.albumSongs &&
      album.albumSongs.map(songId => {
        const song = songs[songId];
        if (!song) return null;
        const group = groups[song.groupId] || null;
        return (
          <ListGroupItem
            key={songId}
            className="py-0 px-2  d-flex justify-content-between align-items-center text-uppercase"
          >
            <div>
              <span>
                {song.title} {song.subTitle}
              </span>
              {group && (
                <span
                  style={{ position: "relative", top: "-5px", opacity: ".5" }}
                  className="d-block font-weight-light text-muted"
                >
                  <small>
                    {group.title} {group.subTitle}
                  </small>
                </span>
              )}
            </div>
            {!editing && (
              <Link to={`/admin/songs/${songId}`}>
                <i
                  className="fas fa-arrow-alt-circle-right text-primary"
                  style={{ cursor: "pointer" }}
                />
              </Link>
            )}
            {editing && (
              <i
                className="far fa-minus-square text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.removeThisSongFromAlbum(songId, albumId);
                }}
              />
            )}
          </ListGroupItem>
        );
      });
    const songsNotOnThisAlbum = () => {
      const ids = Object.keys(songs).filter(songId => {
        return !album.albumSongs.includes(songId);
      });
      return (
        <>
          <ListGroupItem divider className="bg-light" />
          {ids.map(songId => {
            const song = songs[songId];
            return (
              <ListGroupItem className="py-1 px-2  d-flex justify-content-between align-items-center">
                <span>
                  {song.title} {song.subTitle}
                </span>
                <i
                  className="far fa-plus-square text-success"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.addThisSongToAlbum(songId, albumId);
                  }}
                />
              </ListGroupItem>
            );
          })}
        </>
      );
    };

    return (
      <Col {...this.cardColumnSizes}>
        <Card className="mt-2 bg-light ">
          <CardHeader className="text-center pb-2 bg-light">
            <h6 className="text-muted mb-0">
              {album.title}
              {editing && <i className="fas fa-edit text-success ml-2" />}
            </h6>
            {album.subtitle && (
              <div style={{ lineHeight: "11px" }}>
                <small class="text-muted text-uppercase">
                  {album.subtitle}
                </small>
              </div>
            )}
          </CardHeader>
          <ListGroup action="true" flush>
            {songsOnThisAlbum}
            {editing && songsNotOnThisAlbum()}
          </ListGroup>
          <CardFooter className="p-1">
            {editing ? (
              <>
                <Button
                  className="btn-info btn-link btn-block btn-sm"
                  onClick={() => this.editThisAlbum("")}
                >
                  done
                </Button>
                <div className="d-flex justify-content-around">
                  <Button
                    color="danger"
                    className="btn-link btn-sm"
                    onClick={() => this.removeAllSongs(albumId)}
                  >
                    <small>Remove songs</small>
                  </Button>
                  <Button
                    size="sm"
                    className="btn-link btn-sm "
                    onClick={() => this.deleteThisAlbum(albumId)}
                    disabled={album.albumSongs.length}
                  >
                    <small>delete album</small>
                  </Button>
                </div>
                {/* <Tooltip
                  toggle={() => this.tooltipToggle(albumId)}
                  isOpen={this.state.tooltipOpen === albumId}
                  placement="right"
                  target="deleteTooltip"
                  trigger="click"
                >
                  Remove all songs to DELETE this album.
                </Tooltip> */}
              </>
            ) : (
              <Button
                className="btn-info btn-link btn-block btn-sm"
                onClick={() => this.editThisAlbum(albumId)}
              >
                edit
              </Button>
            )}
          </CardFooter>
        </Card>
      </Col>
    );
  };
  albumsList() {
    const { albums } = this.props;
    const validate = values => {
      const errors = {};
      const { albumTitle } = values;
      if (!albumTitle) errors.albumTitle = "Title is required";
      return errors;
    };
    return (
      <>
        <Row>
          {Object.keys(albums).map(albumId =>
            this.albumCard(albums[albumId], albumId)
          )}
          <Col {...this.cardColumnSizes}>
            <Form validate={validate} onSubmit={this.createNewAlbum}>
              {({ values, pristine, hasValidationErrors, handleSubmit }) => {
                return (
                  <Card>
                    <CardHeader className="text-center pb-2">
                      <h6 className="text-muted mb-0">
                        {values.albumTitle || "CREATE NEW ALBUM"}
                      </h6>
                      {values.albumSubtitle && (
                        <div style={{ lineHeight: "11px" }}>
                          <small class="text-muted text-uppercase">
                            {values.albumSubtitle}
                          </small>
                        </div>
                      )}
                    </CardHeader>
                    <StyledForm onSubmit={handleSubmit}>
                      <CardBody>
                        <TextInput
                          name="albumTitle"
                          label="Album Title"
                          placeholder="Album Title"
                          titleCase
                        />
                        <TextInput
                          name="albumSubtitle"
                          label="Subtitle"
                          placeholder="Live at Wednesdays"
                        />
                      </CardBody>
                      <CardFooter>
                        <Button disabled={hasValidationErrors}>
                          Create Album
                        </Button>
                      </CardFooter>
                    </StyledForm>
                  </Card>
                );
              }}
            </Form>
          </Col>
        </Row>
      </>
    );
  }
  render() {
    const { albums, songs } = this.props;
    if (albums && songs) {
      return this.albumsList();
    } else {
      return <LoadingSpinner />;
    }
  }
}

const mapState = state => ({
  albums: state.firestore.data.albums,
  songs: state.firestore.data.songs,
  groups: state.firestore.data.groups
});
export default compose(
  connect(mapState),
  firestoreConnect()
)(AlbumsAdmin);
