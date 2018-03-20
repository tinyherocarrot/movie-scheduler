import React, { Component } from "react";
import styled from "styled-components";

const StyledSpan = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

class ExpandButton extends Component {
  render() {
    return (
      <StyledSpan>
        <a>{this.props.collapsed ? "+" : "-"}</a>
      </StyledSpan>
    );
  }
}
export default ExpandButton;
