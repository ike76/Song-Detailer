import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Button } from "reactstrap";
// my stuff
import "./App.css";
import store from "./store";
// import SongDetails from "./components/SongDetails.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import FakePage from "./pages/FakePage.jsx";
import NavBar from "./components/NavBar.jsx";
import ModalManager from "./components/ModalManager";
import AutoSuggester from "./forms/formComponents/autoSuggester.jsx";
import { StyledGrid } from "./helpers";
class App extends Component {
  state = {
    showGrid: false
  };
  toggleGrid = () => {
    this.setState({ showGrid: !this.state.showGrid });
  };
  render() {
    return (
      <Router>
        <Provider store={store}>
          <StyledGrid show={this.state.showGrid}>
            <>
              <Button onClick={this.toggleGrid}>grid</Button>
              <NavBar />
              <ModalManager />
              <ToastContainer />
              <Switch>
                <Route path="/admin/:section/:id" component={AdminPage} />
                {/* 👆 this has to be before the less specific /:section */}
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
          </StyledGrid>
        </Provider>
      </Router>
    );
  }
}

export default App;
