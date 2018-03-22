import styled from "styled-components";

const Alert = styled.div`
  margin: 0.5em;
  color: ${props => {
    if (props.type === "danger") return "rgb(255, 61, 61)";
    if (props.type === "success") return "rgb(127,255,91)";
  }};
`;

export default Alert;
