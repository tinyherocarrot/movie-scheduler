import React, { Component } from "react";
import API from "./util/API";

class App extends Component {
  state = {
    movieName: "",
    movieDuration: "",
    showTimes: ""
  };

  componentDidMount = () => {
    console.log(API.fullSchedule);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    // const newMovie = {
    //   movieName: this.state.movieName,
    //   movieDuration: this.state.movieDuration
    // };

    this.setState({
      showTimes: API.fullSchedule(
        11,
        23,
        10.5,
        24,
        parseInt(this.state.movieDuration)
      )
    });
  };

  render() {
    return (
      <div>
        <h1>Welcome to Movie Scheduler!</h1>
        <form onClick={this.handleFormSubmit}>
          Movie Name:<br />
          <input
            type="text"
            name="movieName"
            value={this.state.movieName}
            placeholder="Inception"
            onChange={this.handleInputChange}
          />
          <br />
          Duration: (min)<br />
          <input
            type="text"
            name="movieDuration"
            value={this.state.movieDuration}
            placeholder="120"
            onChange={this.handleInputChange}
          />
          <br />
          <button onClick={this.handleFormSubmit}> Add Movie</button>
        </form>

        <p> {JSON.stringify(this.state.showTimes, null, 2)} </p>
      </div>
    );
  }
}

export default App;
