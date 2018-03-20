import React, { Component } from "react";
import Table from "./components/Table";

import API from "./util/API";
import * as firebase from "firebase";
import Container from "./components/Container";
import ExpandButton from "./components/ExpandButton";

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
    newCinemaCollapsed: true,
    movieName: "",
    movieDuration: "",
    selectedCinema: "",
    cinemaName: "",
    weekdayOpenTime: "",
    weekdayCloseTime: "",
    weekendOpenTime: "",
    weekendCloseTime: "",
    cinemasList: [],
    showTimes: []
  };

  componentDidMount = () => {
    const rootRef = firebase.database().ref();
    rootRef.on("value", snap => {
      if (snap.hasChild("cinemas")) {
        console.log("wow you have cinemas!");
        // writeCinemas(snapValues.cinemas)
        this.setState({
          cinemasList: snap.child("cinemas").val()
        });
      } else {
        console.log("no cinemas found :(");
      }

      if (snap.hasChild("showTimes")) {
        console.log("wow you have showtimes!");
        // writeShowTimes()
        let snapValues = snap.child("showTimes").val();
        console.log(snapValues);

        let data = {};
        Object.keys(snapValues).forEach((cinema, i) => {
          let cinemaShowTimes = snapValues[cinema];
          data[cinema] = [];

          Object.keys(cinemaShowTimes).forEach((movie, i) => {
            let _movie = cinemaShowTimes[movie];

            let newRow = {
              name: _movie.movieName,
              monday: _movie.showTimes.weekday.join(" \n "),
              tuesday: _movie.showTimes.weekday.join(" \n "),
              wednesday: _movie.showTimes.weekday.join(" \n "),
              thursday: _movie.showTimes.weekday.join(" \n "),
              friday: _movie.showTimes.weekend.join(" \n "),
              saturday: _movie.showTimes.weekend.join(" \n "),
              sunday: _movie.showTimes.weekend.join(" \n "),
              key: i
            };
            data[cinema].push(newRow);
          });
        });
        console.log(data);

        this.setState({
          showTimes: data
        });
      } else {
        console.log("no showtimes found :(");
      }
    });
  };

  handleCollapse = () => {
    console.log(`before ${this.state.newCinemaCollapsed}`);
    let collapsed = !this.state.newCinemaCollapsed;
    this.setState({
      newCinemaCollapsed: collapsed
    });
    console.log(`after ${this.state.newCinemaCollapsed}`);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  addNewCinema = () => {
    let newCinema = {
      weekdayOpenTime: this.state.weekdayOpenTime,
      weekdayCloseTime: this.state.weekdayCloseTime,
      weekendOpenTime: this.state.weekendOpenTime,
      weekendCloseTime: this.state.weekendCloseTime
    };
    console.log(newCinema);

    const cinemasRef = firebase
      .database()
      .ref()
      .child("cinemas");
    let _cinemaName = this.state.cinemaName;
    cinemasRef.child(_cinemaName).set(newCinema);
  };

  addNewMovie = () => {
    let _selectedCinema = this.state.selectedCinema;
    if (!_selectedCinema) {
      alert("no cinema selected!");
      return;
    }
    // access to cinema's hours
    let cinemaHours = this.state.cinemasList[_selectedCinema];
    console.log("here are the selected cinema's hours", cinemaHours);

    // capture form data, create newMovie obj
    let newMovie = {
      movieName: this.state.movieName,
      movieDuration: this.state.movieDuration,
      showTimes: API.fullSchedule(
        cinemaHours.weekdayOpenTime,
        cinemaHours.weekdayCloseTime,
        cinemaHours.weekendOpenTime,
        cinemaHours.weekendCloseTime,
        parseInt(this.state.movieDuration)
      )
    };
    console.log(newMovie);

    // push newMovie to "showTimes" node in Firebase DB
    const showTimesRef = firebase
      .database()
      .ref()
      .child("showTimes");
    showTimesRef.child(_selectedCinema).push(newMovie);

    // clear form
    this.setState({
      movieName: "",
      movieDuration: ""
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    switch (event.target.value) {
      case "add-cinema":
        this.addNewCinema();
        break;
      case "add-movie":
        this.addNewMovie();
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Container>
        <h1>Welcome to Movie Scheduler!</h1>
        <form onSubmit={this.handleFormSubmit}>
          <h3>
            Add a New Cinema{" "}
            <ExpandButton
              collapsed={this.state.newCinemaCollapsed}
              onClick={this.handleCollapse}
            />
          </h3>
          Cinema Name:<br />
          <input
            type="text"
            name="cinemaName"
            value={this.state.cinemaName}
            onChange={this.handleInputChange}
          />
          <br />
          Weekday Opening Time: <br />
          <input
            type="text"
            name="weekdayOpenTime"
            value={this.state.weekdayOpenTime}
            onChange={this.handleInputChange}
          />
          <br />
          Weekday Closing Time: <br />
          <input
            type="text"
            name="weekdayCloseTime"
            value={this.state.weekdayCloseTime}
            onChange={this.handleInputChange}
          />
          <br />
          Weekend Opening Time: <br />
          <input
            type="text"
            name="weekendOpenTime"
            value={this.state.weekendOpenTime}
            onChange={this.handleInputChange}
          />
          <br />
          Weekend Closing Time: <br />
          <input
            type="text"
            name="weekendCloseTime"
            value={this.state.weekendCloseTime}
            onChange={this.handleInputChange}
          />
          <br />
          <button onClick={this.handleFormSubmit} value="add-cinema">
            {" "}
            Add Cinema
          </button>
        </form>{" "}
        <br />
        <form onSubmit={this.handleFormSubmit}>
          <h3>Add a New Movie</h3>
          <select
            defaultValue={this.state.selectedCinema}
            onChange={this.handleInputChange}
            name="selectedCinema"
          >
            <option disabled="disabled" value="prompt">
              Please select a cinema
            </option>
            {Object.keys(this.state.cinemasList).map((cinema, i) => {
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
          <button onClick={this.handleFormSubmit} value="add-movie">
            {" "}
            Add Movie
          </button>
        </form>
        <br />
        {this.state.showTimes
          ? Object.keys(this.state.showTimes).map((cinema, i) => {
              return (
                <div key={i}>
                  <h4>{cinema} Showtimes</h4>
                  <Table data={this.state.showTimes[cinema]} />
                </div>
              );
            })
          : "Loading Showtimes..."}
      </Container>
    );
  }
}

export default App;
