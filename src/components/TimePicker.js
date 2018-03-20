import "rc-time-picker/assets/index.css";

import React, { Component } from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";

const format = "H:mm";

class MyTimePicker extends Component {
  handleInputChange = e => {
    // event returns moment object,
    // so we will pass back to onChange function as formatted time string
    this.props.onChange({ name: this.props.name, value: e.format("H:mm") });
  };
  render() {
    return (
      <TimePicker
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
