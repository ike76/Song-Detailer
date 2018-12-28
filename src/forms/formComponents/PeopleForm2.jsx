import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import styled from "styled-components";
import { name as fakeName, internet, lorem } from "faker";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { Form } from "react-final-form";
import windowSize from "react-window-size";
//
import TextInput from "./textInput.jsx";
import ImageDisplayer from "../../components/ImageDisplayer.jsx";

export const ImageBox = styled.div`
  border-radius: 10px 10px 0 0;
  position: relative;
  width: 200px;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #d4d4d4;
  background-image: url(${p =>
    `https://res.cloudinary.com/homecomp/image/upload/b_rgb:d6d6d6,c_fill,g_face,h_200,w_200/v1545416123/${
      p.url
    }`});
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  ${p =>
    p.editing &&
    `
    &::after {
      position: absolute;
      background: #ffffffba;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      content: " ";
    }
    `}
`;

// const randomPersonImageUrl = () => {
//   const sex = ["men", "women"][Math.floor(Math.random() + 0.5)];
//   const number = Math.floor(Math.random() * 100);
//   const url = `https://randomuser.me/api/portraits/${sex}/${number}.jpg`;
//   console.log(url);
//   return url;
// };

class PeopleForm2 extends Component {
  state = {
    pageCount: 10,
    page: 1
  };

  allSongsObj = (() => {
    const { people, account, groups, songs } = this.props;
    if (!people || !account || !groups || !songs) return "not ready";
    const { peopleAttributeNames } = account;
    const stripOutAttributeFields = inputObj => {
      let returnObj = {};
      Object.keys(peopleAttributeNames).forEach(attr => {
        returnObj[attr] = inputObj[attr];
      });
      return returnObj;
    };
    const _allSongsObj = songs.reduce((obj, song) => {
      const songRoles = {};
      // each song has each role, with an empty array
      Object.keys(peopleAttributeNames).forEach(role => {
        songRoles[role] = [];
      });
      if (song.groupId && song.groupId !== "custom") {
        const group = groups.find(g => g.id === song.groupId);
        obj[song.id] = stripOutAttributeFields(group);
      } else {
        obj[song.id] = stripOutAttributeFields(song);
      }
      return obj;
    }, {});
    return _allSongsObj;
  })();

  componentDidUpdate() {
    console.log("allSongsObj", this.allSongsObj);
  }

  handlePageClick = data => {
    console.log("pageClickData", data);
    this.setState({ page: data.selected });
  };
  personInfo = p => {
    const { account } = this.props;
    const { peopleAttributeNames } = account;
    const mySongsThisRole = role => {
      return Object.keys(this.allSongsObj).reduce((arr, songId) => {
        if (
          this.allSongsObj[songId][role] &&
          this.allSongsObj[songId][role].includes(p.id)
        )
          arr.push(songId);
        return arr;
      }, []);
    };
    const roles = Object.keys(peopleAttributeNames).reduce((obj, role) => {
      obj[role] = mySongsThisRole(role);
      return obj;
    }, {});
    return {
      fullName: `${p.firstName} ${p.lastName}`,
      roles
    };
  };
  render() {
    const { people, songs } = this.props;
    return (
      <>
        <Row className="justify-content-around">
          {people.map(p => (
            <PersonCard
              key={p.id}
              {...p}
              personInfo={this.personInfo(p)}
              songs={songs}
            />
          ))}
        </Row>
      </>
    );
  }
}

const fakePerson = () => ({
  firstName: fakeName.firstName(),
  lastName: fakeName.lastName(),
  description: lorem.sentences(2),
  imageUrl: internet.avatar()
});

class PersonCard extends Component {
  state = {
    editing: false
  };
  toggleEdit = () => {
    this.setState({ editing: !this.state.editing });
  };
  componentDidMount() {
    this.setState({ ...fakePerson() });
  }
  onSubmit = values => console.log("values", values);
  editingForm = (
    <Form onSubmit={this.onSubmit}>
      {({ values, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <Col className="px-1">
                <TextInput
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                />
              </Col>
              <Col className="px-1">
                <TextInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </Col>
            </div>
          </form>
        );
      }}
    </Form>
  );
  render() {
    const { editing } = this.state;
    const { personInfo, songs, ...person } = this.props;
    const { roles } = personInfo;
    return (
      <Card style={{ width: "200px" }}>
        {editing ? (
          <ImageDisplayer person={person} editing={true} />
        ) : (
          <ImageBox url={person.profileImage} editing={editing} />
        )}

        <CardHeader className="d-flex justify-content-between py-0 px-1">
          <h6 class="card-title">
            {person.firstName} {person.lastName}
          </h6>
        </CardHeader>
        {this.state.editing ? (
          this.editingForm
        ) : (
          <>
            <CardBody className=" p-1 ">
              {/* {showMe(roles, "roles")} */}
              <ListGroup flush>
                {Object.keys(roles).map(role => {
                  if (!roles[role].length) return null;
                  return (
                    <>
                      <ListGroupItem
                        action
                        className="py-0 px-1 text-capitalize font-weight-bold "
                      >
                        {role}
                      </ListGroupItem>
                      {roles[role].map(songId => {
                        const song = songs.find(s => s.id === songId);
                        return (
                          <ListGroupItem action className="py-0 px-1  ">
                            <Link to={`/admin/songs/${songId}`}>
                              <small class="text-capitalize">
                                {song.title}
                              </small>
                            </Link>
                          </ListGroupItem>
                        );
                      })}
                    </>
                  );
                })}
                {/* <ListGroupItem action className="py-0 px-1 ">
                  monster mash
                </ListGroupItem>
                <ListGroupItem action className="py-0 px-1 ">
                  How Long Haw This
                </ListGroupItem>
                <ListGroupItem action className="py-0 px-1 font-weight-bold ">
                  PRODUCER
                </ListGroupItem>
                <ListGroupItem action className="py-0 px-1 ">
                  Other thing
                </ListGroupItem>
                <ListGroupItem action className="py-0 px-1 ">
                  monster mash
                </ListGroupItem>
                <ListGroupItem action className="py-0 px-1 ">
                  How Long Haw This
                </ListGroupItem> */}
              </ListGroup>
            </CardBody>
          </>
        )}

        <CardFooter>
          <Button
            className="btn-link btn-info btn-sm btn-block "
            onClick={this.toggleEdit}
          >
            {editing ? "save" : "edit"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
}

const mapState = state => ({
  people: state.firestore.ordered.people,
  account: state.firestore.ordered.accounts[0],
  songs: state.firestore.ordered.songs,
  groups: state.firestore.ordered.groups,
  albums: state.firestore.ordered.albums
});
export default compose(
  connect(mapState),
  windowSize
)(PeopleForm2);
