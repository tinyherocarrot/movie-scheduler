import React, { Component } from "react";
import API from "./util/API";
import * as firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAfE4ydC1Zk-UAQWnZnhS7bCeRWeG0V3LU",
  authDomain: "movie-schedule-automate.firebaseapp.com",
  databaseURL: "https://movie-schedule-automate.firebaseio.com",
  projectId: "movie-schedule-automate",
  storageBucket: "movie-schedule-automate.appspot.com",
  messagingSenderId: "465397375050"
};
firebase.initializeApp(config);

class App extends Component {
  state = {
    movieName: "",
    movieDuration: "",
    showTimes: ""
  };

  componentDidMount = () => {
    const rootRef = firebase
      .database()
      .ref()
      .child("cinema1");
    const cinemaRef = rootRef.child("cinema1");
    cinemaRef.on("value", snap => {
      console.log(snap.val());

      this.setState({
        showTimes: snap.val()
      });
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    let newMovie = {
      movieName: this.state.movieName,
      movieDuration: this.state.movieDuration,
      showTimes: API.fullSchedule(
        11,
        23,
        10.5,
        24,
        parseInt(this.state.movieDuration)
      )
    };
    const rootRef = firebase
      .database()
      .ref()
      .child("cinema1");
    console.log(newMovie);
    let _movieName = this.state.movieName;
    rootRef.child(_movieName).set(newMovie);
  };

  render() {
    return (
      <div>
        <h1>Welcome to Movie Scheduler!</h1>
        <form onSubmit={this.handleFormSubmit}>
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
