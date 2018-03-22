// import moment from "moment";
var moment = require("moment"); // for backwards compability testing

// This function takes in an opening and closing time, and duration of the movie,
// and outputs an array of showtimes, as according to the cinema's guidelines (see below)
const schedule = (openingTime, closingTime, movieDuration) => {
  let open = moment({
    hour: openingTime
  });
  let close = moment({
    hour: closingTime
  });

  // if the closing time is after midnight, add one day to close
  //    .add(7, 'days');
  if (close.isSameOrBefore(moment({ hour: "03:00" }))) {
    close.add(1, "days");
  }

  let res = [];
  let currentTime = moment(close);
  let actual_open = open.add(15, "minutes");

  // The cinema requires 15 minutes after opening before the first movie is shown.
  while (currentTime.isAfter(actual_open)) {
    let showTime = moment(currentTime);

    // if this is not the last showing,
    if (!currentTime.isSame(close)) {
      // then add 20 mintues to showtime for cleanup
      showTime.subtract(movieDuration + 20, "minutes");
    } else {
      showTime.subtract(movieDuration, "minutes");
    }

    // round showTime up to the nearest factor of 5
    while (showTime.get("minutes") % 5 !== 0) {
      showTime.subtract(1, "minutes");
    }

    // if the calculated showtime is valid (not before actual openingTime),
    if (showTime.isAfter(actual_open)) {
      // then add on the calculated showtime
      console.log(`hey whatup
      `);
      res.unshift(showTime.format("HH:mm"));
    }

    // add in 15m for previews
    currentTime = moment(showTime);
    currentTime.subtract(15, "minutes");
  }
  return res;
};

// This function takes in cinema's weekday and weekend hours of operation, and a movie's duration,
// and outputs an object containing arrays of weekday and weekend showtimes.
const fullSchedule = (
  wkdyOpen,
  wkdyClose,
  wkndOpen,
  wkndClose,
  movieDuration
) => {
  return {
    weekday: schedule(wkdyOpen, wkdyClose, movieDuration),
    weekend: schedule(wkndOpen, wkndClose, movieDuration)
  };
};

export default {
  fullSchedule: fullSchedule
};

// console.log(tomorrow3AM.date());
// let close = moment({ hour: "23:00" });
// console.log(close.isBefore(tomorrow3AM));

// Test Case #1
// console.log(fullSchedule("11:00", "23:00", "10:30", "24:00", 86));
// ---> expected output: { weekday: [ '13:10', '15:15', '17:20', '19:25', '21:30' ],
//                         weekend: [ '12:05', '14:10', '16:15', '18:20', '20:25', '22:30' ] }

// Test Case #2

// ====================================  Requirements ==================================== //
// - Each movie should start at easy to read times (eg 10:00, 10:05, 10:10).
// - The start time of the movie is exactly at the posted start time.
// - Each movie requires 15 minutes for previews before the start of the movie.
// - Each movie requires 20 minutes after its end time to prepare the theatre for the next
// movie 5.
//
// Here is a list of rules that are global to the cinema:
// - The cinema requires 15 minutes after opening before the first movie is shown.
// - No movie should end after the cinema’s hours of operation.
// - The last showing should end as close as possible to the end of the cinema’s hours of
// operation.
//
// Hours of Operation
// The theatre has the following hours of operation.
// - Monday - Thursday 11am - 11pm. - Friday - Sunday 10:30 am - 12 am.
// - (!) We will be assuming that the latest that a theatre will run is 3am, and the
// earliest it will open is 9am.
// ======================================================================================= //
