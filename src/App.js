import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
// my stuff
import "./App.css";
import store from "./store";
// import SongDetails from "./components/SongDetails.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NavBar from "./components/NavBar.jsx";
import ModalManager from "./components/ModalManager";
import AutoSuggester from "./forms/formComponents/autoSuggester.jsx";
class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <>
            <NavBar />
            <ModalManager />
            <Switch>
              <Route path="/admin/:section/:id" component={AdminPage} />
              <Route path="/admin/:section" component={AdminPage} />
              <Route
                path="/test/auto"
                component={() => (
                  <div className="container">
                    <AutoSuggester />
                  </div>
                )}
              />
            </Switch>
          </>
        </Provider>
      </Router>
    );
  }
}

export default App;
