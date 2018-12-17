import React, { Component, Fragment } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { connect } from "react-redux";
import LoadingSpinner from "../../../components/loadingSpinner";

export class PersonnelGroupPicker extends Component {
  state = {
    groupSelectedId: "",
    dropdownOpen: false
  };
  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };
  selectGroup = groupId => {
    this.setState({ groupSelectedId: groupId });
    this.props.handleSelectGroup(groupId);
  };
  formatGroup = group => (
    <span className="d-inline-block text-center text-uppercase ">
      <p className="m-0">
        <b>{group.title}</b>
      </p>
      <small className="m-0">{group.subTitle}</small>
    </span>
  );

  groupDropdown() {
    const { groups } = this.props;
    const selectedGroup = groups[this.state.groupSelectedId];
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
        <DropdownToggle caret>
          {selectedGroup ? this.formatGroup(selectedGroup) : "select a group"}
        </DropdownToggle>
        <DropdownMenu>
          {Object.keys(groups).map(groupId => {
            const group = groups[groupId];
            return (
              <Fragment key={groupId}>
                <DropdownItem
                  className="p-1 text-center"
                  onClick={() => this.selectGroup(groupId)}
                >
                  {this.formatGroup(group)}
                </DropdownItem>
                <DropdownItem divider />
              </Fragment>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }
  render() {
    const { groups } = this.props;
    if (groups) {
      return this.groupDropdown();
    } else {
      return <LoadingSpinner />;
    }
  }
}
const mapState = state => ({
  groups: state.firestore.data.groups,
  account: state.firestore.ordered.accounts[0]
});
export default connect(mapState)(PersonnelGroupPicker);
