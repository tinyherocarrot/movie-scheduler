import "rc-time-picker/assets/index.css";

import React, { Component } from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";
import styled from "styled-components";

const format = "H:mm";

const StyledTimePicker = styled(TimePicker)`
  color: black !important;
  margin: 0.5em;
  font-size: 1em !important;
`;

class MyTimePicker extends Component {
  handleInputChange = e => {
    // event returns moment object,
    // so we will pass back to onChange function as formatted time string
    // console.log({ name: this.props.name, value: e.format("H:mm") });
    this.props.onChange({
      target: { name: this.props.name, value: e.format("H:mm") }
    });
  };

  render() {
    return (
      <StyledTimePicker
        name={this.props.name}
        defaultValue={moment({ hour: 12 })}
        showSecond={false}
        style={{ width: 100 }}
        onChange={this.handleInputChange}
        format={format}
      />
    );
  }
}

export default MyTimePicker;
