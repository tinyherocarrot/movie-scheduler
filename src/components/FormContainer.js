import styled from "styled-components";

const FormContainer = styled.div`
  margin: 1em;
  padding: 1em;
  display: ${props => (props.collapsed ? "none" : "block")};
  -webkit-box-shadow: 2px 3px 11px 0px rgba(50, 50, 50, 0.47);
  -moz-box-shadow: 2px 3px 11px 0px rgba(50, 50, 50, 0.47);
  box-shadow: 2px 3px 11px 0px rgba(50, 50, 50, 0.47);
  border-radius: 0.3em;
  width: ${props => (props.half ? "50%" : "100%")};
  text-align: center;
`;

export default FormContainer;
