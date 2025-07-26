import styled from 'styled-components';

export const ClubDetailFooterContainer = styled.div`
  display: none;

  @media (max-width: 500px) {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 65px;
    z-index: 100;
    padding: 10px 40px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    background-color: white;
    border-top: 1px solid #cdcdcd;
  }
`;
