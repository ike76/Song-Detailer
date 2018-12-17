import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { connect } from "react-redux";
import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Card,
  CardBody
} from "reactstrap";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import PropTypes from "prop-types";
//
import AutoSuggestDisplayer from "./autoSuggestDisplayer.jsx";
//
// import theme from "./autoSuggesterTheme.css";
// import AutoTagger from "../autoTagger.jsx";

const styles = {
  suggestionsList: {
    background: "pink",
    listStyle: "none"
  }
};
export class AutoSuggester extends Component {
  state = {
    value: "",
    suggestions: [],
    valueList: []
  };
  static propTypes = {
    attribute: PropTypes.string.isRequired
  };
  componentDidMount() {
    const { initialTags } = this.props;
    if (initialTags) {
      this.setState({ valueList: initialTags });
    }
  }
  componentDidUpdate(prevProps) {}
  addTag = () => {
    this.setState(
      prevState => ({
        valueList: [
          ...prevState.valueList.filter(v => v !== prevState.value),
          prevState.value
        ],
        value: "",
        suggestions: []
      }),
      this.updateFirestore
    );
  };
  updateFirestore = () => {
    const { firestore, currentSongId, attribute } = this.props;
    const { valueList } = this.state;
    firestore.update(
      {
        collection: "songs",
        doc: currentSongId
      },
      {
        [attribute]: valueList
      }
    );
  };
  removeTag = tag => {
    this.setState(
      state => ({
        valueList: [...state.valueList.filter(v => v !== tag)]
      }),
      this.updateFirestore
    );
  };
  onChange = (e, { newValue }) => {
    this.setState({ value: newValue });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestions =
      inputLength === 0
        ? []
        : this.props.options.filter(
            opt => opt.name.toLowerCase().slice(0, inputLength) === inputValue
          );
    return suggestions;
  };
  getSuggestionValue = suggestion => suggestion.name;
  renderSuggestion = (suggestion, { query, isHighlighted }) => (
    <div style={{ cursor: "pointer", fontWeight: isHighlighted ? "bold" : "" }}>
      {suggestion.name}
    </div>
  );
  renderInputComponent = ({ label, ...inputProps }) => (
    <FormGroup>
      <Label>{label}</Label>
      <InputGroup>
        <Input
          {...inputProps}
          onKeyPress={e => {
            if (e.key === "Enter") this.addTag();
          }}
        />
        <InputGroupAddon addonType="append">
          <Button className="m-0" onClick={this.addTag}>
            ADD
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>
  );
  render() {
    const { value, suggestions } = this.state;
    const { label, placeholder } = this.props;
    const inputProps = {
      placeholder: placeholder || "Type here",
      value,
      onChange: this.onChange,
      label: label,
      name: "myName"
    };
    return (
      <>
        <Card>
          <Autosuggest
            theme={styles}
            renderInputComponent={this.renderInputComponent}
            // renderSuggestionsContainer={this.renderList}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={(event, { method }) => {
              event.stopPropagation();
              if (method !== "enter") this.addTag(); // addTag is called from the onKeyPress of the input
            }}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
          <CardBody>
            <AutoSuggestDisplayer tags={this.state.valueList} />
          </CardBody>
        </Card>
      </>
    );
  }
}
const mapState = (state, props) => ({
  currentSong: state.current.songs,
  currentSongId: state.current.id,
  initialTags: state.current.songs[props.attribute]
});
export default compose(
  connect(mapState),
  firestoreConnect()
)(AutoSuggester);
