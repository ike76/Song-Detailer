import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";
import { openModal } from "../actions/currentActions";
//
class NavBarMine extends Component {
  state = {
    isOpen: false,
    modalOpen: false
  };
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { signedIn, history } = this.props;
    return (
      <div>
        <Navbar color="primary" expand="sm">
          <Container>
            <NavbarBrand href="/">Song Detailer</NavbarBrand>
            <NavbarToggler onClick={this.toggle}>
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </NavbarToggler>

            <Collapse id="navbarContent" isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Admin
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => history.push(`/admin/songs`)}>
                      Songs
                    </DropdownItem>
                    <DropdownItem onClick={() => history.push(`/admin/albums`)}>
                      Albums
                    </DropdownItem>
                    <DropdownItem onClick={() => history.push(`/admin/people`)}>
                      People
                    </DropdownItem>
                    <DropdownItem onClick={() => history.push(`/admin/groups`)}>
                      Groups
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink
                    as="a"
                    href="#"
                    onClick={() => this.props.openModal("SIGN_IN")}
                  >
                    {signedIn ? "SIGN OUT" : "SIGN IN"}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/other">Other </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}
const mapState = state => ({
  signedIn: state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty,
  displayName: state.firebase.auth.displayName
});
const mapDispatch = {
  openModal
};
export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  withRouter
)(NavBarMine);
