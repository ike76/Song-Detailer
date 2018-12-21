import React, { Component, Fragment } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { connect } from "react-redux";
//
import LoadingSpinner from "../../../components/loadingSpinner";
import { formatGroup } from "../../../helpers";
export class PersonnelGroupPicker extends Component {
  state = {
    groupSelectedId: "",
    dropdownOpen: false
  };
  componentDidMount() {
    const { groupId } = this.props;
    if (groupId) this.setState({ groupSelectedId: groupId });
    console.log("mounted with group id");
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.groupId !== this.props.groupId)
      this.setState({ groupSelectedId: this.props.groupId });
  }
  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };
  selectGroup = groupId => {
    this.setState({ groupSelectedId: groupId });
    this.props.handleSelectGroup(groupId);
  };

  groupDropdown() {
    const { groups, disabled, direction, groupId } = this.props;
    const selectedGroup = groups[this.state.groupSelectedId];
    return (
      <Dropdown
        direction={direction}
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown}
      >
        <DropdownToggle caret disabled={disabled} className="my-0">
          {selectedGroup ? formatGroup(selectedGroup) : "select a group"}
        </DropdownToggle>
        <DropdownMenu>
          <div style={{ overflow: "auto", maxHeight: "100vh" }}>
            {Object.keys(groups)
              .filter(gid => gid !== groupId)
              .map(_groupId => {
                const group = groups[_groupId];
                return (
                  <Fragment key={_groupId}>
                    <DropdownItem
                      className="p-1 text-center"
                      onClick={() => this.selectGroup(_groupId)}
                    >
                      {formatGroup(group)}
                    </DropdownItem>
                    <DropdownItem divider />
                  </Fragment>
                );
              })}
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
  groupSelect() {}
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
