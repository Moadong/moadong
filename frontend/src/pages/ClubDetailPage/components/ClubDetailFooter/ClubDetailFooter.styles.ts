import styled from 'styled-components';

export const ClubDetailFooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 1100; // TODO: Portal로 모달 분리 후 header보다 낮게 재조정
  padding: 10px 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  background-color: white;
  border-top: 1px solid #cdcdcd;
`;
