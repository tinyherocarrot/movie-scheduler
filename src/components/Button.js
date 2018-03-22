import styled from "styled-components";

const Button = styled.button`
  padding: 0.5em;
  border-radius: 0.3em;
  border: solid 1px white;
  background: transparent;
  color: white;
  margin: 1em auto;
  font-size: 1em;
  font-weight: lighter;

  &:hover {
    background: white;
    color: black;
    cursor: pointer;
  }
  &:focus {
    outline: 0;
  }
`;

export default Button;
