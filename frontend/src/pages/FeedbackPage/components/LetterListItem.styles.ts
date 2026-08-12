import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

/** 읽지 않은 편지는 배경을 채워 구분한다 (시안 주석: 읽지않은 상태일 때 fill 활성화) */
export const Item = styled.button<{ $unread?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-bottom: 1px solid ${colors.gray[300]};
  background: ${({ $unread }) =>
    $unread ? colors.gray[50] : colors.base.white};
  text-align: left;
  cursor: pointer;
`;

export const Title = styled.p`
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.gray[800]};
  letter-spacing: -0.32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Preview = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: ${colors.gray[600]};
  letter-spacing: -0.24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeAgo = styled.span`
  flex-shrink: 0;
  ${setTypography(typography.button.button2)};
  color: ${colors.gray[600]};
  letter-spacing: -0.24px;
`;

/** 보낸 편지는 제목 없이 본문 한 줄만 보여준다 */
export const SentContent = styled.p`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[800]};
  letter-spacing: -0.28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SentItem = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-bottom: 1px solid ${colors.gray[300]};
  background: ${colors.base.white};
  text-align: left;
  cursor: pointer;
`;
