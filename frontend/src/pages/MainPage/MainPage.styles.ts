import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 0 40px;
  max-width: 1180px;
  margin: 0 auto;

  @media (max-width: 500px) {
    padding: 0 20px;
  }

  @media (max-width: 375px) {
    padding: 0 10px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
`;

export const CardList = styled.div`
  display: grid;
  width: 100%;
  max-width: 100%;
  gap: 35px;
  margin-top: 50px;
  transition:
    gap 0.5s ease,
    grid-template-columns 0.5s ease;

  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (max-width: 500px) {
    gap: 16px;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  justify-content: right;
  margin: 20px 0;
`;
