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
  gap: 20px;
  margin-top: 50px;
  transition:
    gap 0.5s ease,
    grid-template-columns 0.5s ease;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (max-width: 500px) {
    gap: 6px;
    margin-top: 16px;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  justify-content: right;
  margin: 20px 0;
`;

export const EmptyResult = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: #555;
  font-size: 1.125rem;
  line-height: 1.6;
  white-space: pre-line;

  @media (max-width: 500px) {
    font-size: 0.95rem;
  }
`;
