import {
  PEOPLE_SUCCESS,
  PEOPLE_FETCHING,
  PEOPLE_ERROR
} from "../actions/peopleActions";

const initialState = {
  allPeople: null,
  currentPerson: "",
  isFetching: false,
  error: null
};

const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PEOPLE_PENDING": {
      return { ...state, isFetching: true };
    }
    case "PEOPLE_FULFILLED": {
      const allPeople = action.payload;
      return { ...state, isFetching: false, allPeople };
    }
    case "PEOPLE_ERROR": {
      const error = action.payload;
      return { ...state, isFetching: false, error };
    }
    default:
      return state;
  }
};

export default peopleReducer;
