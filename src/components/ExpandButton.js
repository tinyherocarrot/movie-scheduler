import React, { Component } from "react";
import styled from "styled-components";

const StyledSpan = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

class ExpandButton extends Component {
  handleClick = () => {
    this.props.handleCollapse();
  };

  render() {
    return (
      <StyledSpan onClick={this.handleClick}>
        <a>
          {this.props.name} {this.props.collapsed ? "+" : "-"}
        </a>
      </StyledSpan>
    );
  }
}
export default ExpandButton;
