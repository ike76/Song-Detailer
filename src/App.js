import React, { Component } from "react";
import { CloudinaryContext } from "cloudinary-react";
import { Provider } from "react-redux";
// my stuff
import SongDetails from "./components/SongDetails.jsx";
import store from "./store";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Provider store={store}>
          <CloudinaryContext cloudName="homecomp">
            <SongDetails />
          </CloudinaryContext>
        </Provider>
      </div>
    );
  }
}

export default App;
