import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  margin: 1em 1em;
  padding: 1em;
  background: ${props =>
    props.fill ? "rgba(255,250,240, 0.5)" : "transparent"};
  border-radius: 0.4em;
  text-align: center;
`;

export const Container = props => {
  return <StyledContainer {...props} />;
};
