import styled from 'styled-components';

export const AdminPageContainer = styled.div`
  display: flex;
  margin-top: 98px;
  align-items: flex-start;
`;

export const Divider = styled.div`
  position: sticky;
  top: 98px;
  width: 1px;
  height: calc(100vh - 98px);
  background-color: #dcdcdc;
  margin: 0 34px;
  flex-shrink: 0;
`;


export const Content = styled.main`
  width: 100%;
  max-width: 977px;
  padding: 62px 58px;
`;
