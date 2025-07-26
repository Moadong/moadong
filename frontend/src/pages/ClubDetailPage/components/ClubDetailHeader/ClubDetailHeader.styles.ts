import styled from 'styled-components';

export const ClubDetailHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 150px;

  @media (max-width: 500px) {
    & > button {
      display: none;
    }
    margin-top: 40px;
  }
`;
