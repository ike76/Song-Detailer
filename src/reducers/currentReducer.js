import {
  SET_CURRENT,
  OPEN_MODAL,
  CLOSE_MODAL
} from "../actions/currentActions";

const initialState = {
  songs: {}, // holds the current song
  people: {}, // holds the current person
  adminId: "hAEoRLPjh97E5FBbxKpM",
  modal: null
};

const currentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT: {
      const { attrName, currentObj } = action.payload;
      return { ...state, [attrName]: currentObj };
    }
    case OPEN_MODAL: {
      return { ...state, modal: action.name };
    }
    case CLOSE_MODAL: {
      return { ...state, modal: null };
    }
    default: {
      return state;
    }
  }
};
export default currentReducer;
