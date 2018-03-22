import styled from "styled-components";

const StyledFlexContainer = styled.div`
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default StyledFlexContainer;
