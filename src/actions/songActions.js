import { getSongs, callCreateSong, callUpdateSong } from "./apiActions";

export const ADD_SONG = "ADD_SONG";
export const addSong = songInfo => ({
  type: ADD_SONG,
  songInfo
});

export const addSongFS = songInfo => async (
  dispatch,
  getState,
  getFirestore
) => {
  const firestore = getFirestore();
  const response = await firestore.collection("songs").add(songInfo);
};

export const SET_CURRENT_SONG = "SET_CURRENT_SONG";
export const setCurrentSong = songId => ({
  type: SET_CURRENT_SONG,
  songId
});

export const getAllSongs = () => ({
  type: "SONGS",
  payload: getSongs()
});

export const createSong = songInfo => ({
  type: "NEW_SONG",
  payload: callCreateSong(songInfo)
});

export const updateSong = songInfo => ({
  type: "UPDATE_SONG",
  payload: callUpdateSong(songInfo)
});
