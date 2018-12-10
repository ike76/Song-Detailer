import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CloudinaryContext } from "cloudinary-react";
import { Provider } from "react-redux";
// my stuff
import store from "./store";
import SongDetails from "./components/SongDetails.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NavBar from "./components/NavBar.jsx";
import ModalManager from "./components/ModalManager";
class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <>
            <NavBar />
            <ModalManager />
            <Switch>
              <Route path="/songEdit" component={SongDetails} />
              <Route path="/admin/:section/:id" component={AdminPage} />
              <Route path="/admin/:section" component={AdminPage} />
              <Route path="/" component={SongDetails} />
            </Switch>
          </>
        </Provider>
      </Router>
    );
  }
}

export default App;
