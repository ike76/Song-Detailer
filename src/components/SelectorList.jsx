import React, { Component, Fragment } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  FormGroup,
  Label,
  Row,
  Col
} from "reactstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class SelectorList extends Component {
  state = {
    dropdownOpen: false
  };
  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };
  render() {
    const {
      listOptions,
      currentOptionId,
      resourceType,
      formatter,
      resourceSingular,
      buttonDropdown,
      history
    } = this.props;

    const dropdownList = (
      <Row className=" ">
        <Col>
          <FormGroup>
            <Label for="resourceSelect">{`select ${resourceSingular}`}</Label>
            <Input
              id="resourceSelect"
              type="select"
              defaultValue={currentOptionId}
              onChange={e =>
                history.push(`/admin/${resourceType}/${e.target.value}`)
              }
            >
              <option>{`Select a ${resourceSingular}`}</option>
              {Object.keys(listOptions).map((resourceId, i) => {
                const resource = listOptions[resourceId];
                return (
                  <option key={resourceId} value={resourceId}>
                    {formatter(resource)}
                  </option>
                );
              })}
              <option value={"new"}> Add New </option>;
            </Input>
          </FormGroup>
        </Col>
      </Row>
    );
    const buttonList = (
      <div>
        <Label className="mb-0 d-block">{`select ${resourceSingular}`}</Label>
        <ButtonDropdown
          className="mt-0"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggleDropdown}
        >
          <DropdownToggle
            caret
            // color="info"
            className="p-2 text-center btn-block mt-0"
          >
            {currentOptionId !== "none"
              ? formatter(listOptions[currentOptionId])
              : `select ${resourceSingular}`}
          </DropdownToggle>
          <DropdownMenu>
            {Object.keys(listOptions).map(resourceId => {
              return (
                <Fragment key={resourceId}>
                  <DropdownItem
                    key={resourceId}
                    onClick={() =>
                      history.push(`/admin/${resourceType}/${resourceId}`)
                    }
                  >
                    {formatter(listOptions[resourceId])}
                  </DropdownItem>
                  <DropdownItem divider />
                </Fragment>
              );
            })}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
    return (
      <>
        {/* {showMe(listOptions, `listOptions ${typeof listOptions}`)} */}
        {!buttonDropdown && dropdownList}
        {buttonDropdown && buttonList}
        {/* {expandedList} */}
      </>
    );
  }
}

SelectorList.propTypes = {
  listOptions: PropTypes.object.isRequired,
  currentOptionId: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  formatter: PropTypes.func.isRequired
};

export default withRouter(SelectorList);
