import React, { Component } from "react";

import Table from "./Table";
import Container from "./Container";
import FlexContainer from "./FlexContainer";

class ShowtimesDisplay extends Component {
  handleDelete = e => {
    this.props.deleteCinema(e);
  };
  render() {
    return (
      <Container fill="true">
        {Object.keys(this.props.state.cinemasList).length ? (
          Object.keys(this.props.state.cinemasList).map((cinema, i) => {
            return (
              <FlexContainer key={i}>
                <div>
                  <h2>{cinema}</h2>
                  <a onClick={() => this.handleDelete(cinema)}>Remove</a>
                </div>
                <h5>
                  MON-THU {this.props.state.cinemasList[cinema].wkdyOpen}-
                  {this.props.state.cinemasList[cinema].wkdyClose}
                  <br /> FRI-SUN {
                    this.props.state.cinemasList[cinema].wkndOpen
                  }-
                  {this.props.state.cinemasList[cinema].wkndClose}
                </h5>
                {Object.keys(this.props.state.cinemasList).length ? (
                  <Table data={this.props.state.showTimes[cinema]} />
                ) : (
                  `No showtimes yet for ${cinema}`
                )}
              </FlexContainer>
            );
          })
        ) : (
          <p>Add a cinema to begin</p>
        )}
      </Container>
    );
  }
}

export default ShowtimesDisplay;
