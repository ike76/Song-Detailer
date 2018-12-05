import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import promiseMiddleware from "redux-promise-middleware";

// firebase stuff
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import {
  reactReduxFirebase,
  firebaseReducer,
  getFirebase
} from "react-redux-firebase";
import {
  reduxFirestore,
  firestoreReducer,
  getFirestore
} from "redux-firestore";
// import reducers
import songsReducer from "./reducers/songsReducer";
import peopleReducer from "./reducers/peopleReducer";
import adminReducer from "./reducers/adminReducer";
import currentReducer from "./reducers/currentReducer";
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};
const firebaseConfig = {
  apiKey: "AIzaSyCunjaNbCq3dRDnta1zARd_SZjO0ZXZ274",
  authDomain: "song-detailer.firebaseapp.com",
  databaseURL: "https://song-detailer.firebaseio.com",
  projectId: "song-detailer",
  storageBucket: "",
  messagingSenderId: "714813334241"
};
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });
const createStoreWithFirebase = compose(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, rrfConfig)
)(createStore);

export const rootReducer = combineReducers({
  songs: songsReducer,
  people: peopleReducer,
  admin: adminReducer,
  current: currentReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

const store = createStoreWithFirebase(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk.withExtraArgument(getFirestore),
      logger,
      promiseMiddleware()
    )
  )
);

export default store;
