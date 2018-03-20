import styled from "styled-components";

const Container = styled.div`
  margin: 1em;
  padding: 1em;
  {/* height: ${props => (props.collapsed ? "0" : "100%")}; */}
  display: ${props => (props.collapsed ? "none" : "initial")};
`;

export default Container;
