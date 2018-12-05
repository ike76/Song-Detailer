import {
  ADD_SONG,
  SET_CURRENT_SONG,
  GET_ALL_SONGS
} from "../actions/songActions";
import { SET_CURRENT } from "../actions/currentActions";
import Moment from "moment";

const initialState = {
  allSongs: {},
  currentSongId: "",
  isFetching: false,
  isSaving: false,
  error: null
};
const initialStatex = {
  currentSongId: "649713",
  allSongs: {
    "112345": {
      title: "Hey Shut yo mouf",
      artistBand: "babs654312",
      publishers: ["trdLLC75615", "JLPMtunes123456"],
      composers: ["macca654321"],
      releaseDate: new Moment("2018-06-13T05:00:00.000Z")
    },
    "987654": {
      artistBand: "white234235",
      publishers: ["JLPMtunes123456"],
      composers: ["turfur12345", "lennon12345"],
      releaseDate: new Moment("2018-08-17T05:00:00.000Z"),
      title: "You Hurt My Teeth"
    },
    "649713": {
      title: "tangerine Rainblow",
      artistBand: "turds987654",
      publishers: ["trdLLC75615"],
      composers: ["turfur12345"],
      releaseDate: new Moment("2018-07-04T05:00:00.000Z")
    },

    "741852": {
      title: "All Damn Day",
      artistBand: "babs654312",
      publishers: ["JLPMtunes123456"],
      composers: ["lennon12345"],
      releaseDate: new Moment("2018-04-14T05:00:00.000Z")
    }
  }
};
const songsReducer = (state = initialState, action) => {
  console.log(`${action.type} in reducer`);
  switch (action.type) {
    case ADD_SONG: {
      // do stuff
      return state;
    }
    case SET_CURRENT_SONG: {
      return { ...state, currentSongId: action.songId };
    }

    case "SONGS_FULFILLED": {
      const allSongs = action.payload;
      const allSongsObj = allSongs.reduce((obj, song) => {
        obj[song._id] = song;
        return obj;
      }, {});
      console.log("all songs obj", allSongsObj);
      return { ...state, allSongs: allSongsObj, currentSongId: undefined };
    }
    case "NEW_SONG_PENDING": {
      return { ...state, isSaving: true };
    }
    case "NEW_SONG_FULFILLED": {
      const newSong = action.payload;
      const newAllSongs = { ...state.allSongs, [newSong._id]: newSong };
      return { ...state, isSaving: false, allSongs: newAllSongs };
    }
    case "UPDATE_SONG_PENDING": {
      return { ...state, isSaving: true };
    }
    case "UPDATE_SONG_FULFILLED": {
      const newSong = action.payload;
      return {
        ...state,
        isSaving: false,
        allSongs: { ...state.allSongs, [newSong._id]: newSong }
      };
    }
    default:
      return state;
  }
};

export default songsReducer;
