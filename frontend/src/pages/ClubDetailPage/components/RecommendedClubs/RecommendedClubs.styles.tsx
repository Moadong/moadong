import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  width: 100%;
  border-radius: 18px;
  border: 1px solid #dcdcdc;
  padding: 30px;
  gap: 30px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

// 반응형 그리드 리스트
export const GridList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 기본 2열
  gap: 16px;

  // 화면 넓이 600px 이하일 경우 1열로 변경
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
`;
