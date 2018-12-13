import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Input,
  FormGroup,
  Label,
  Row,
  Col
} from "reactstrap";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

const SelectorList = props => {
  const {
    listOptions,
    currentOptionId,
    resourceType,
    formatter,
    resourceSingular
  } = props;
  // const expandedList = (
  //   <ListGroup className="d-none d-md-block" flush>
  //     {Object.keys(listOptions).map((key, i) => {
  //       const resource = listOptions[key];
  //       return !resource ? null : (
  //         <Link key={key} to={`/admin/${resourceType}/${key}`}>
  //           <ListGroupItem
  //             key={key}
  //             action
  //             active={currentOptionId === key}
  //             className="py-1 py-md-2"
  //           >
  //             {formatter(resource)}
  //           </ListGroupItem>
  //         </Link>
  //       );
  //     })}
  //     <Link to={`/admin/${resourceType}/new`}>
  //       <ListGroupItem action active={currentOptionId === "new"}>
  //         * Add New *
  //       </ListGroupItem>
  //     </Link>
  //   </ListGroup>
  // );
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
              props.history.push(`/admin/${resourceType}/${e.target.value}`)
            }
          >
            <option>{`Select a ${resourceSingular}`}</option>
            {Object.keys(listOptions).map((key, i) => {
              const resource = listOptions[key];
              return (
                <option key={key} value={key}>
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
  return (
    <>
      {dropdownList}
      {/* {expandedList} */}
    </>
  );
};

SelectorList.propTypes = {
  listOptions: PropTypes.object.isRequired,
  currentOptionId: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  formatter: PropTypes.func.isRequired
};

export default withRouter(SelectorList);
