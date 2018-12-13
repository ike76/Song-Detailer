import React, { Component } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  TabPane,
  TabContent
} from "reactstrap";
import { connect } from "react-redux";
//
import { setCurrent } from "../../actions/currentActions";
//
export const categories = ["Files", "Basics", "Vibes", "Sounds", "Topics"];
export class SongFormNav extends Component {
  state = {
    activeTab: 1
  };
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    return (
      <div className="nav-tabs-navigation">
        <div className="nav-tabs-wrapper">
          <Nav tabs>
            {categories.map((cat, i) => (
              <NavItem key={cat}>
                <NavLink
                  className={this.props.currentPage === i ? "active" : ""}
                  onClick={() => {
                    this.props.setCurrent("songPage", i);
                  }}
                >
                  {cat}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </div>
    );
  }
}
const mapState = state => ({
  currentPage: state.current.songPage || 0
});
const mapDispatch = {
  setCurrent
};
export default connect(
  mapState,
  mapDispatch
)(SongFormNav);
