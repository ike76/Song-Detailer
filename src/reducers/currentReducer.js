import { SET_CURRENT } from "../actions/currentActions";

const initialState = {
  song: null,
  person: null,
  adminId: "hAEoRLPjh97E5FBbxKpM"
};

const currentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT: {
      const { attrName, attrId } = action.payload;
      return { ...state, [attrName]: attrId };
    }
    default: {
      return state;
    }
  }
};
export default currentReducer;
