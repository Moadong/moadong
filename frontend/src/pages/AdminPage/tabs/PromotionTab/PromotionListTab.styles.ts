import styled, { css } from 'styled-components';
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

export const CompactHeader = styled.div`
  display: flex;
  justify-content: flex-end;
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

export const CardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Card = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid ${colors.gray[400]};
  border-radius: 20px;
  background: ${colors.base.white};

  ${media.tablet} {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
  }
`;

export const Thumbnail = styled.button`
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  padding: 0;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.gray[100]};
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  ${media.tablet} {
    width: 72px;
    height: 72px;
  }
`;

export const ThumbnailPlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;

export const CardTitle = styled.p`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.p`
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[700]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  ${media.tablet} {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${colors.gray[400]};
  border-radius: 8px;
  background: ${colors.base.white};
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[800]};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${colors.gray[100]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $danger }) =>
    $danger &&
    css`
      color: #ef4444;
      border-color: #fca5a5;

      &:hover:not(:disabled) {
        background: #fff1f2;
      }
    `}
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
