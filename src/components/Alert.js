import styled from "styled-components";

const Alert = styled.div`
  padding: 1.2em;
  margin: 0.5em;
  border-radius: 0.5em;
  background: ${props =>
    props.danger ? "rgb(255, 61, 61)" : "rgb(127,255,91)"};
`;

export default Alert;
