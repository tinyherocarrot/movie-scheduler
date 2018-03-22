import React, { Component } from "react";

import TimePicker from "./TimePicker";
import TextInput from "./TextInput";
import Button from "./Button";
import Alert from "./Alert";

class AddCinemaForm extends Component {
  handleInputChange = e => {
    this.props.handleInputChange(e);
  };

  handleFormSubmit = e => {
    this.props.handleFormSubmit(e);
  };
  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        Cinema Name:<br />
        <TextInput
          type="text"
          name="cinemaName"
          value={this.props.state.cinemaName}
          onChange={this.handleInputChange}
        />
        <br />
        Weekday Opening Time: <br />
        <TimePicker onChange={this.handleInputChange} name="wkdyOpen" />
        <br />
        Weekday Closing Time: <br />
        <TimePicker onChange={this.handleInputChange} name="wkdyClose" />
        <br />
        Weekend Opening Time: <br />
        <TimePicker onChange={this.handleInputChange} name="wkndOpen" />
        <br />
        Weekend Closing Time: <br />
        <TimePicker onChange={this.handleInputChange} name="wkndClose" />
        <br />
        <Button onClick={this.handleFormSubmit} value="add-cinema">
          Add Cinema
        </Button>
        <Alert type={this.props.state.alert.type}>
          {this.props.state.alert.cinema}
        </Alert>
      </form>
    );
  }
}

export default AddCinemaForm;
