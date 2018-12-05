import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CloudinaryContext } from "cloudinary-react";
import { Provider } from "react-redux";
// my stuff
import SongDetails from "./components/SongDetails.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <Switch>
            <Route path="/songEdit" component={SongDetails} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/" component={SongDetails} />
          </Switch>
        </Provider>
      </Router>
    );
  }
}

export default App;
