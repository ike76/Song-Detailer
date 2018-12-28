import React from "react";
import { Row, Col, Button, ListGroup, ListGroupItem, Label } from "reactstrap";
import { Form } from "react-final-form";
import { firestoreConnect } from "react-redux-firebase";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import Moment from "moment";
//
import AudioPlayer from "../../../components/AudioPlayer.jsx";
import TextInput from "../textInput.jsx";
import DateInput from "../dateInput.jsx";
import SelectInput from "../selectInput.jsx";
import { StyledForm } from "../../../helpers";
import WhiteOut from "../../../components/Modals/WhiteOut.jsx";
import { openWhiteout, closeWhiteout } from "../../../actions/currentActions";

const SongFormBasics = ({
  songId,
  currentSong,
  currentSongId,
  groups,
  albums,
  firebase,
  firestore,
  history,
  openWhiteout,
  closeWhiteout
}) => {
  const handleSubmit = _values => {
    const values = {
      ..._values,
      releaseDate:
        (_values.releaseDate && Moment(_values.releaseDate).format()) || ""
    };
    delete values.albums;
    console.log("form values", values);
    if (songId === "new") {
      // create song
      console.log("creating new");
      createSong(values);
    } else {
      // update song
      updateSong(values);
      console.log("updating");
    }
  };
  const createSong = values => {
    firestore
      .add(
        {
          collection: "songs"
        },
        {
          ...values,
          adminId: firebase.auth().currentUser.uid
        }
      )
      .then(({ id }) => {
        history.push(`/admin/songs/${id}`);
      });
  };
  const updateSong = values => {
    firestore.update(
      {
        collection: "songs",
        doc: songId
      },
      values
    );
  };
  const deleteSong = () => {
    removeSongFromAllAlbums(songId)
      .then(() => {
        return firestore.delete({
          collection: "songs",
          doc: songId
        });
      })
      .then(() => {
        closeWhiteout();
        history.push(`/admin/songs`);
      })
      .catch(err => console.error("error!", err));
  };
  const removeSongFromAllAlbums = songId => {
    function getAlbumsWithThisSong(arr, album) {
      if (album.albumSongs && album.albumSongs.includes(songId))
        arr.push(album);
      return arr;
    }
    const albumsWithSong = albums.reduce(getAlbumsWithThisSong, []);
    function deleteSongFromThisAlbum(album) {
      return new Promise((resolve, reject) => {
        const albumSongsOld = [...album.albumSongs];
        const albumSongsFiltered = albumSongsOld.filter(a => a !== songId);
        firestore
          .update(
            {
              collection: "albums",
              doc: album.id
            },
            {
              albumSongs: albumSongsFiltered
            }
          )
          .then(() => {
            resolve(`${songId} removed`);
          });
      });
    }
    const albumPromises = albumsWithSong.map(album => {
      return deleteSongFromThisAlbum(album);
    });
    return Promise.all(albumPromises);
  };
  const showDeleteWarning = () => {
    const message = (
      <>
        <p>Are you sure you want to delete</p>
        <div className="border p-2 bg-white text-uppercase">
          <b>{currentSong.title}</b>
          <br />
          <small className="text-muted">{currentSong.subTitle}</small>
        </div>
        <div className="d-flex justify-content-between">
          <Button className="btn-danger" onClick={deleteSong}>
            DELETE
          </Button>
          <Button className="btn-outline-warning" onClick={closeWhiteout}>
            cancel
          </Button>
        </div>
      </>
    );

    openWhiteout("areYouSure", { message });
  };
  // const toggleSongOnAlbum = e => {
  //   const { checked, value: albumId } = e.target;
  //   const album = albums.find(a => a.id === albumId);
  //   if (!album) return null;
  //   let updatedAlbumSongs;
  //   const songOnAlbum = album.albumSongs.includes(currentSongId);
  //   if (!songOnAlbum) {
  //     // add song
  //     updatedAlbumSongs = [...album.albumSongs, currentSongId];
  //   } else {
  //     // remove song
  //     updatedAlbumSongs = [...album.albumSongs].filter(
  //       s => s !== currentSongId
  //     );
  //   }
  //   firestore.update(
  //     { collection: "albums", doc: albumId },
  //     { albumSongs: updatedAlbumSongs }
  //   );
  // };
  const groupOptions =
    groups &&
    groups.map(group => ({
      value: group.id,
      display: `${group.title} • ${group.subTitle}`
    }));
  const validate = values => {
    const errors = {};
    const { title } = values;
    if (!title) errors.title = "Title is Required";
    if (!Moment(values.releaseDate).isValid())
      errors.releaseDate = "Please choose a release date";
    return errors;
  };
  const albumsForForm =
    albums &&
    albums.reduce((arr, album) => {
      if (album.albumSongs.includes(songId)) {
        arr.push(album.id);
      }
      return arr;
    }, []);

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={{ ...currentSong, albums: albumsForForm }}
      validate={validate}
    >
      {({ handleSubmit, values, hasValidationErrors, pristine }) => {
        return (
          <WhiteOut>
            <StyledForm onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                  <TextInput
                    name="title"
                    label="Song Title *"
                    placeholder="Song Title"
                    titleCase={true}
                  />
                  <TextInput
                    name="subTitle"
                    label="Subtitle (optional)"
                    placeholder="live version, house mix, etc"
                  />
                  <DateInput
                    name="releaseDate"
                    label="Release Date"
                    viewMode="months"
                    closeOnSelect
                  />
                </Col>
                <Col xs={12} md={6}>
                  <AudioPlayer values={values} />
                  <SelectInput
                    name="groupId"
                    label="Group"
                    options={groupOptions}
                    resource="group"
                  />
                  <TextInput
                    name="isrc"
                    label="ISRC code"
                    placeholder="US-S1Z-99-00001"
                  />
                  {(function albumsThisSongIsOn() {
                    if (currentSongId === "new") return null;
                    return (
                      <div>
                        <Label> included on albums: </Label>
                        <ListGroup />
                        {albums &&
                          albums
                            .filter(
                              a => a.albumSongs && a.albumSongs.includes(songId)
                            )
                            .map(fAlbum => {
                              return (
                                <ListGroupItem
                                  key={fAlbum.id}
                                  className="p-1"
                                  action
                                >
                                  <Link to={`/admin/albums/${fAlbum.id}`}>
                                    {fAlbum.title}{" "}
                                    <span className="text-muted">
                                      {fAlbum.subtitle}
                                    </span>
                                  </Link>
                                </ListGroupItem>
                              );
                            })}
                        {!albums ||
                          (albums.filter(
                            a => a.albumSongs && a.albumSongs.includes(songId)
                          ).length === 0 && (
                            <ListGroupItem className="p-1" action>
                              <Link to={`/admin/albums`}>NO ALBUM</Link>
                            </ListGroupItem>
                          ))}
                      </div>
                    );
                  })()}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={hasValidationErrors || pristine}
                  >
                    SAVE
                  </Button>
                  <Button onClick={showDeleteWarning}>delete song</Button>
                </Col>
              </Row>
            </StyledForm>
          </WhiteOut>
        );
      }}
    </Form>
  );
};

const mapState = (state, props) => ({
  currentSong: state.current.songs,
  currentSongId: state.current.id,
  groups: state.firestore.ordered.groups,
  albums: state.firestore.ordered.albums
});
const mapDispatch = {
  openWhiteout,
  closeWhiteout
};
export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firestoreConnect(),
  withRouter
)(SongFormBasics);
