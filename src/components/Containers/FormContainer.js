import React from "react";
import styled from "styled-components";

const StyledFormContainer = styled.div`
  margin: 1em 1.3em;
  padding: 1em;
  display: ${props => (props.collapsed ? "none" : "block")};
  -webkit-box-shadow: 2px 3px 11px 1px rgba(50, 50, 50, 0.47);
  -moz-box-shadow: 2px 3px 11px 1px rgba(50, 50, 50, 0.47);
  box-shadow: 2px 3px 11px 1px rgba(50, 50, 50, 0.47);
  border-radius: 0.3em;
  width: ${props => (props.half ? "50%" : "100%")};
  text-align: center;
`;

export const FormContainer = props => {
  return <StyledFormContainer {...props} />;
};
