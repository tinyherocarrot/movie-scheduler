import React, { Component } from "react";
import Table from "./components/Table";

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
    showTimes: []
  };

  componentDidMount = () => {
    const rootRef = firebase
      .database()
      .ref()
      .child("cinema1");
    // const cinemaRef = rootRef.child("cinema1");
    rootRef.on(
      "value",
      snap => {
        let snapValues = snap.val();

        // push snap values into an array, then setState
        // ---------------------------------------------
        let data = [];
        Object.keys(snapValues).forEach((key, i) => {
          let movie = snapValues[key];
          let newRow = {
            name: movie.movieName,
            monday: movie.showTimes.weekday.join(" \n "),
            tuesday: movie.showTimes.weekday.join(" \n "),
            wednesday: movie.showTimes.weekday.join(" \n "),
            thursday: movie.showTimes.weekday.join(" \n "),
            friday: movie.showTimes.weekend.join(" \n "),
            saturday: movie.showTimes.weekend.join(" \n "),
            sunday: movie.showTimes.weekend.join(" \n "),
            key: i
          };
          data.push(newRow);
        });

        this.setState({
          showTimes: data
        });
      },
      errorObject => {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    // capture form data, create newMovie obj
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
    console.log(newMovie);

    // push newMovie to cinema1 node in Firebase DB
    const rootRef = firebase
      .database()
      .ref()
      .child("cinema1");
    let _movieName = this.state.movieName;
    rootRef.child(_movieName).set(newMovie);

    // clear form
    this.setState({
      movieName: "",
      movieDuration: ""
    });
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
            onChange={this.handleInputChange}
          />
          <br />
          Duration: (min)<br />
          <input
            type="text"
            name="movieDuration"
            value={this.state.movieDuration}
            onChange={this.handleInputChange}
          />
          <br />
          <button onClick={this.handleFormSubmit}> Add Movie</button>
        </form>
        <br />
        {this.state.showTimes.length ? (
          <Table data={this.state.showTimes} />
        ) : (
          "Loading Showtimes..."
        )}
      </div>
    );
  }
}

export default App;
