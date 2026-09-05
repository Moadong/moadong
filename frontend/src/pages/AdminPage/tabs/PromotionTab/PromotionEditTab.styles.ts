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
    padding-bottom: calc(80px + env(safe-area-inset-bottom) + 32px);
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
  gap: 24px;
  padding: 24px 20px 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CancelButton = styled.button`
  height: 42px;
  padding: 0 16px;
  border: 1px solid ${colors.gray[400]};
  border-radius: 10px;
  background: ${colors.base.white};
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[700]};
  cursor: pointer;

  &:hover {
    background: ${colors.gray[100]};
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

export const Label = styled.label`
  display: block;
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const HelperText = styled.p`
  margin-top: 6px;
  font-size: 0.8125rem;
  color: ${colors.gray[600]};
`;

export const Select = styled.select`
  width: 100%;
  height: 45px;
  padding: 0 18px;
  border: 1px solid ${colors.gray[500]};
  border-radius: 6px;
  background-color: transparent;
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 3px;
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }

  &:invalid {
    color: ${colors.gray[600]};
  }
`;

export const MapPreview = styled.div`
  margin-top: 12px;
  width: 100%;
  height: 189px;
  border-radius: 20px;
  border: 1px solid ${colors.gray[400]};
  overflow: hidden;
  background-color: #f2f2f2;
`;

export const DateTimeRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DateTimeInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background-color: ${colors.gray[100]};
  font-size: 1rem;
  color: ${colors.gray[700]};

  &:disabled {
    background-color: ${colors.gray[400]};
    color: ${colors.gray[500]};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 80px 20px;
  text-align: center;

  button {
    margin-top: 12px;
  }
`;

export const EmptyTitle = styled.p`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.primary[900]};
`;

export const EmptyDescription = styled.p`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
`;
