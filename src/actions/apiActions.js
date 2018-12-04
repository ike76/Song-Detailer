import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

let peopleCalls = 1;
let songsCalls = 1;
let createSongCalls = 1;
let updateSongCalls = 1;
export const getSongs = async () => {
  console.log("calling getSongs", songsCalls);
  songsCalls++;
  const songs = await axios.get(`${API_URL}/songs`);
  console.log("songs", songs);
  return songs.data;
};

export const callCreateSong = async songInfo => {
  console.log("calling create song", createSongCalls);
  createSongCalls++;
  const response = await axios.post(`${API_URL}/songs`, songInfo);
  console.log("response from axios", response);
  return response.data;
};
export const callUpdateSong = async songInfo => {
  console.log("calling update song", updateSongCalls);
  updateSongCalls++;
  const response = await axios.post(
    `${API_URL}/songs/${songInfo._id}`,
    songInfo
  );
  console.log("response", response);
  return response.data;
};
export const getPeople = async () => {
  console.log("calling getPeople", peopleCalls);
  peopleCalls++;
  const people = await axios.get(`${API_URL}/people`);
  return people.data;
};
