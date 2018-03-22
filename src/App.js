import React, { Component } from "react";

import * as firebase from "firebase";
import moment from "moment";

// import {
// Container,
// FormContainer,
// FlexContainer,
// PageContainer
// } from "./components/Containers";
import FormContainer from "./components/FormContainer";
import FlexContainer from "./components/FlexContainer";
import PageContainer from "./components/PageContainer";

import AddMovieForm from "./components/AddMovieForm";
import AddCinemaForm from "./components/AddCinemaForm";
import ShowtimesDisplay from "./components/ShowtimesDisplay";

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
    movieName: "",
    movieDuration: "",
    selectedCinema: "",
    cinemaName: "",
    wkdyOpen: "12:00",
    wkdyClose: "12:00",
    wkndOpen: "12:00",
    wkndClose: "12:00",
    cinemasList: {},
    showTimes: {},
    alert: ""
  };

  componentDidMount = () => {
    const rootRef = firebase.database().ref();

    // initialize onValue listener for cinemas
    const cinemaRef = rootRef.child("cinemas");
    cinemaRef.on("value", snap => {
      let _cinemasList = snap.val();
      if (_cinemasList !== null) {
        console.log("wow you have cinemas!");
        this.setState({
          cinemasList: _cinemasList,
          selectedCinema: Object.keys(_cinemasList)[0]
        });
      }
    });

    // initialize onValue listener for showTimes
    const showTimesRef = rootRef.child("showTimes");
    showTimesRef.on("value", snap => {
      let snapValues = snap.val();
      if (snapValues !== null) {
        let data = {};
        Object.keys(snapValues).forEach((cinema, i) => {
          let cinemaShowTimes = snapValues[cinema];
          data[cinema] = [];

          Object.keys(cinemaShowTimes).forEach((movie, i) => {
            let _movie = cinemaShowTimes[movie];

            let newRow = {
              name: _movie.movieName.concat(`\n (${_movie.movieDuration}m)`),

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
        this.setState({
          showTimes: data
        });
      }
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // clear alert message in state after 3 seconds
  setAlertTimeout = () => {
    setTimeout(() => {
      this.setState({
        alert: ""
      });
    }, 3000);
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

    this.setState({
      movieName: "",
      movieDuration: "",
      alert: { cinema: "Cinema added successfully", type: "success" }
    });
    this.setAlertTimeout();
  };

  addNewMovie = () => {
    let _selectedCinema = this.state.selectedCinema;
    if (!_selectedCinema) {
      alert("no cinema selected!");
      return;
    }
    // access to cinema's hours
    let cinemaHours = this.state.cinemasList[_selectedCinema];

    // capture form data, create newMovie obj
    let newMovie = {
      movieName: this.state.movieName,
      movieDuration: this.state.movieDuration,
      showTimes: API.fullSchedule(
        cinemaHours.wkdyOpen,
        cinemaHours.wkdyClose,
        cinemaHours.wkndOpen,
        cinemaHours.wkndClose,
        parseInt(this.state.movieDuration, 10)
      )
    };
    console.log(newMovie);

    // push newMovie to "showTimes" node in Firebase DB
    const showTimesRef = firebase
      .database()
      .ref()
      .child("showTimes");
    showTimesRef.child(_selectedCinema).push(newMovie);

    // clear form, and set success alert
    this.setState({
      movieName: "",
      movieDuration: "",
      alert: { showTimes: "Showtimes added successfully", type: "success" }
    });
    this.setAlertTimeout();
  };

  deleteCinema = ref => {
    let cinemaRef = firebase.database().ref(`cinemas/${ref}`);
    cinemaRef
      .remove()
      .then(function() {
        console.log("Remove succeeded.");
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
      });
  };

  validateNewCinema = () => {
    let _wkdyOpen = moment({
      hour: this.state.wkdyOpen
    });
    let _wkdyClose = moment({
      hour: this.state.wkdyClose
    });
    let _wkndOpen = moment({
      hour: this.state.wkndOpen
    });
    let _wkndClose = moment({
      hour: this.state.wkndClose
    });

    // if the inputed closing hours are between midnight and 3am, increment the day
    if (_wkdyClose.hours() >= 0 && _wkdyClose.hours() <= 3) {
      _wkdyClose.add(1, "days");
      console.log("_wkdyClose was incrememtned");
    }
    if (_wkndClose.hours() >= 0 && _wkndClose.hours() <= 3) {
      _wkndClose.add(1, "days");
      console.log("_wkndClose was incrememtned");
    }

    let today9AM = moment({ hour: "09:00" });
    let tomorrow3AM = moment({ hour: "03:00" }).add(1, "days");
    // console.log("case 1: ", _wkdyOpen.isSameOrAfter(today9AM));
    // console.log("case 2: ", _wkdyOpen.isBefore(_wkdyClose));
    // console.log("case 3: ", _wkdyClose.isSameOrBefore(tomorrow3AM));
    // console.log("case 4: ", _wkndOpen.isSameOrAfter(today9AM));
    // console.log("case 5: ", _wkndOpen.isBefore(_wkndClose));
    // console.log("case 6: ", _wkndClose.isSameOrBefore(tomorrow3AM));
    // Check for invalid cinema hours:
    //  (9am <= opening_time < closing_time <= 3am)
    if (
      !(
        _wkdyOpen.isSameOrAfter(today9AM) &&
        _wkdyOpen.isBefore(_wkdyClose) &&
        _wkdyClose.isSameOrBefore(tomorrow3AM) &&
        (_wkndOpen.isSameOrAfter(today9AM) &&
          _wkndOpen.isBefore(_wkndClose) &&
          _wkndClose.isSameOrBefore(tomorrow3AM))
      )
    ) {
      // alert user invalid times
      this.setState({
        alert: { cinema: "Please enter valid cinema hours", type: "danger" }
      });
      this.setAlertTimeout();
      return false;
    }
    // if cinema name is empty
    if (!this.state.cinemaName) {
      // alert user to enter a cinema name
      this.setState({
        alert: { cinema: "Please enter a cinema name", type: "danger" }
      });
      this.setAlertTimeout();
      return false;
    }
    return true;
  };

  validateNewMovie = () => {
    // if movie name is empty,
    if (!this.state.movieName) {
      // alert the user invalid movie name
      this.setState({
        alert: { showTimes: "Please enter a movie name", type: "danger" }
      });
      this.setAlertTimeout();
      return false;
    }
    // if movie duration is not a number,
    if (isNaN(parseInt(this.state.movieDuration, 10))) {
      // alert the user of invalid movie duration
      this.setState({
        alert: {
          showTimes: "Please enter a valid movie duration",
          type: "danger"
        }
      });
      this.setAlertTimeout();
      return false;
    }
    return true;
  };

  handleFormSubmit = event => {
    event.preventDefault();
    switch (event.target.value) {
      case "add-movie":
        if (this.validateNewMovie()) {
          this.addNewMovie();
        }
        break;
      case "add-cinema":
        if (this.validateNewCinema()) {
          this.addNewCinema();
        }
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <PageContainer>
        <h1>Welcome to Movie Scheduler!</h1>
        <FlexContainer>
          <FormContainer>
            <h2>Add a New Movie</h2>
            <AddMovieForm
              handleInputChange={this.handleInputChange}
              handleFormSubmit={this.handleFormSubmit}
              state={this.state}
            />
          </FormContainer>
          <FormContainer collapsed={false}>
            <h2>Add a New Cinema</h2>
            <AddCinemaForm
              handleInputChange={this.handleInputChange}
              handleFormSubmit={this.handleFormSubmit}
              state={this.state}
            />
          </FormContainer>
        </FlexContainer>
        <ShowtimesDisplay state={this.state} deleteCinema={this.deleteCinema} />
      </PageContainer>
    );
  }
}

export default App;
