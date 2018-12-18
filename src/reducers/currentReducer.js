import {
  SET_CURRENT,
  OPEN_MODAL,
  CLOSE_MODAL,
  OPEN_WHITEOUT,
  CLOSE_WHITEOUT
} from "../actions/currentActions";

const initialState = {
  songs: {}, // holds the current song
  people: {}, // holds the current person
  adminId: "hAEoRLPjh97E5FBbxKpM",
  modal: null,
  whiteout: "",
  whiteoutProps: ""
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
    case OPEN_WHITEOUT: {
      return {
        ...state,
        whiteout: action.name,
        whiteoutProps: action.whiteoutProps
      };
    }
    case CLOSE_WHITEOUT: {
      return { ...state, whiteout: "" };
    }
    default: {
      return state;
    }
  }
};
export default currentReducer;
