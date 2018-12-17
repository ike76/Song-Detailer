import { ADD_SONG, SET_CURRENT_SONG } from "../actions/songActions";
const initialState = {};
const songsReducer = (state = initialState, action) => {
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
