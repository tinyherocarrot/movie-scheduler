import React, { Component } from "react";

import TextInput from "./TextInput";
import Button from "./Button";
import Alert from "./Alert";

class AddMovieForm extends Component {
  handleInputChange = e => {
    this.props.handleInputChange(e);
  };

  handleFormSubmit = e => {
    this.props.handleFormSubmit(e);
  };
  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <select
          defaultValue={this.props.state.selectedCinema}
          onChange={this.handleInputChange}
          name="selectedCinema"
        >
          <option disabled="disabled" value="prompt">
            Please select a cinema
          </option>
          {Object.keys(this.props.state.cinemasList).map((cinema, i) => {
            return (
              <option key={i} value={cinema}>
                {cinema}
              </option>
            );
          })}
        </select>{" "}
        <br />
        <br />
        Movie Name:<br />
        <TextInput
          type="text"
          name="movieName"
          value={this.props.state.movieName}
          onChange={this.handleInputChange}
        />
        <br />
        Duration: (min)<br />
        <TextInput
          type="text"
          name="movieDuration"
          value={this.props.state.movieDuration}
          onChange={this.handleInputChange}
        />
        <br />
        <Button onClick={this.handleFormSubmit} value="add-movie">
          Add Movie
        </Button>
        <Alert type={this.props.state.alert.type}>
          {this.props.state.alert.showTimes}
        </Alert>
      </form>
    );
  }
}

export default AddMovieForm;
