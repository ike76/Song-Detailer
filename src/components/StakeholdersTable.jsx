import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import BSTable from "react-bootstrap-table-next";
import { Button } from "reactstrap";
//
import { mapStateWhenReady } from "../helpers";
import LoadingSpinner from "./loadingSpinner";

export class StakeholdersTable extends Component {
  state = { loaded: false };
  stuff = [
    {
      name: "Brian Eichenberger",
      Writer: (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button size="sm" color={"info"} outline={false}>
            WRITER
          </Button>
        </div>
      ),
      Producer: "nope",
      Manager: "hells no"
    }
  ];

  columns = [
    { dataField: "name", text: "Stakeholder" },
    { dataField: "price", text: "P Price $" }
  ];
  componentDidUpdate(prevProps, prevState) {
    if (this.props.settings && this.props.stakeholders && !prevState.loaded)
      this.setState({ loaded: true });
  }
  toggleAttribute = (attr, personId) => {
    const { adminId, stakeholders } = this.props;
    const person = stakeholders[personId];
    this.props.firestore.update(
      {
        collection: "accounts",
        doc: adminId,
        subcollections: [{ collection: "stakeholders", doc: personId }]
      },
      {
        [attr]: person[attr] ? false : true
      }
    );
  };
  content() {
    const { settings, stakeholders } = this.props;
    const attributes = settings.stakeholderInfo.attributes;
    const getRequired = person => ({
      name: `${person.firstName} ${person.lastName}`
    });
    const getFlexible = person => {
      const flexAttributes = attributes.reduce((obj, attr) => {
        const active = person[attr.name];
        obj[attr.name] = (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="sm"
              color={active ? "dark" : "info"}
              outline={!active}
              onClick={() => this.toggleAttribute(attr.name, person.id)}
            >
              {attr.name}
            </Button>
          </div>
        );
        return obj;
      }, {});
      return flexAttributes;
    };
    const data = Object.keys(stakeholders).map(key => {
      const person = stakeholders[key];
      return { ...getRequired(person), ...getFlexible({ ...person, id: key }) };
    });
    const customColumns = attributes.map(attr => ({
      dataField: attr.name,
      text: attr.name,
      headerStyle: { textAlign: "center" }
    }));
    const columns = [{ dataField: "name", text: "" }, ...customColumns];
    return <BSTable keyField="id" data={data} columns={columns} />;
  }
  render() {
    return this.content();
  }
}
const mapState = state => ({
  stakeholders: state.firestore.data.people
});
export default compose(connect(mapState))(StakeholdersTable);
