import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import promiseMiddleware from "redux-promise-middleware";
// import reducers
import songsReducer from "./reducers/songsReducer";
import peopleReducer from "./reducers/peopleReducer";

export const rootReducer = combineReducers({
  songs: songsReducer,
  people: peopleReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger, promiseMiddleware()))
);

export default store;
