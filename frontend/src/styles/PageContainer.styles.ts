import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 0 40px;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 500px) {
    padding: 0 20px;
  }

  @media (max-width: 375px) {
    padding: 0 10px;
  }
`;
