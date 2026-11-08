// 검색 데모의 결과 영역(높이 고정)과 동아리 카드 모양 스타일
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* 결과가 나타나고 사라져도 화면 높이가 변하지 않게 자리를 잡아 둔다 */
export const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 240px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: ${colors.base.white};
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.08);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CardText = styled.div`
  min-width: 0;
`;

export const CardName = styled.p`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.base.black};
`;

export const CardIntro = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: ${colors.gray[700]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;
