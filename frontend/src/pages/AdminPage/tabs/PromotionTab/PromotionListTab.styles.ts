import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;

  /* WebviewTopBar는 tablet에서 margin: 0 auto라 flex column 자식이면 내용 너비로 줄어든다. block으로 둔다 */
  ${media.tablet} {
    display: block;
    width: 100%;
    max-width: 500px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: ${colors.base.white};
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
  }

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const CompactBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 40px;
`;

/* 사용자 홍보 목록과 같은 세로형 카드라 그리드로 깐다. 관리자 본문 폭이 좁아 열 수는 따로 잡는다 */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  ${media.laptop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
`;

export const Notice = styled.div`
  padding: 14px 18px;
  border-radius: 12px;
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[300]};
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[800]};
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: ${colors.gray[100]};
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.base.black};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.gray[200]};
  }
`;

export const PlusIcon = styled.img`
  width: 19px;
  height: 19px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 60px 20px;
  border: 1px dashed ${colors.gray[400]};
  border-radius: 20px;
  text-align: center;
`;

export const EmptyTitle = styled.p`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.primary[900]};
`;

export const EmptyDescription = styled.p`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
`;
