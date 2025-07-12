import styled from 'styled-components';

export const ClubDetailHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 150px;

  @media (max-width: 500px) {
    margin-top: 40px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  .share-button {
    padding: 8px 12px !important;
    font-size: 14px !important;
    min-width: auto !important;
    white-space: nowrap;
  }

  @media (max-width: 500px) {
    gap: 6px;
    
    .share-button {
      padding: 4px 8px !important;
      font-size: 11px !important;
      min-width: auto !important;
      border-radius: 4px !important;
    }
  }
`;
