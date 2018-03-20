import React, { Component } from "react";
import * as firebase from "firebase";

import Table from "./components/Table";
import Container from "./components/Container";
import ExpandButton from "./components/ExpandButton";
import FormContainer from "./components/FormContainer";
import TimePicker from "./components/TimePicker";
import TextInput from "./components/TextInput";

import API from "./util/API";

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
    wkdyOpen: "",
    wkdyClose: "",
    wkndOpen: "",
    wkndClose: "",
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
    let collapsed = !this.state.newCinemaCollapsed;
    this.setState({
      newCinemaCollapsed: collapsed
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleTimeChange = e => {
    console.log("line 103: ", e);
  };

  addNewCinema = () => {
    let newCinema = {
      wkdyOpen: this.state.wkdyOpen,
      wkdyClose: this.state.wkdyClose,
      wkndOpen: this.state.wkndOpen,
      wkndClose: this.state.wkndClose
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
        cinemaHours.wkdyOpen,
        cinemaHours.wkdyClose,
        cinemaHours.wkndOpen,
        cinemaHours.wkndClose,
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
        if (
          API.validateNewCinema(
            this.state.wkdyOpen,
            this.state.wkdyClose,
            this.state.wkndOpen,
            this.state.wkndClose
          )
        ) {
          this.addNewCinema();
        } else {
        }
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
      <div>
        <Container>
          <h1>Welcome to Movie Scheduler!</h1>
          <h3>
            <ExpandButton
              name="Add a New Cinema"
              collapsed={this.state.newCinemaCollapsed}
              handleCollapse={this.handleCollapse}
            />
          </h3>
          <FormContainer collapsed={this.state.newCinemaCollapsed}>
            <form onSubmit={this.handleFormSubmit}>
              Cinema Name:<br />
              <TextInput
                type="text"
                name="cinemaName"
                value={this.state.cinemaName}
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
              <button onClick={this.handleFormSubmit} value="add-cinema">
                {" "}
                Add Cinema
              </button>
            </form>{" "}
          </FormContainer>
          <h3>Add a New Movie</h3>
          <FormContainer>
            <form onSubmit={this.handleFormSubmit}>
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
              <TextInput
                type="text"
                name="movieName"
                value={this.state.movieName}
                onChange={this.handleInputChange}
              />
              <br />
              Duration: (min)<br />
              <TextInput
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
          </FormContainer>
        </Container>

        <Container background="grey">
          {this.state.showTimes
            ? Object.keys(this.state.showTimes).map((cinema, i) => {
                return (
                  <Container key={i}>
                    <h4>{cinema} Showtimes</h4>
                    <Table data={this.state.showTimes[cinema]} />
                  </Container>
                );
              })
            : "Loading Showtimes..."}
        </Container>
      </div>
    );
  }
}

export default App;
