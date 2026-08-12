import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { theme } from '@/styles/theme';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: 0 20px 20px;
  background-color: ${theme.colors.gray[50]};

  /* AppLayout이 바텀네비 자리로 56px을 이미 비워두므로 그만큼 뺀다 */
  ${media.tablet} {
    min-height: calc(100dvh - 56px - env(safe-area-inset-bottom));
  }
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${theme.colors.base.black};
  letter-spacing: -0.44px;
  padding: 8px 2px 20px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const cardStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 8px;
  border: none;
  border-radius: 12px;
  background: ${theme.colors.base.white};
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.1));
  text-align: left;
  text-decoration: none;
  cursor: pointer;
`;

export const Card = styled.button`
  ${cardStyles}
`;

/** 우체통 카드. 오른쪽 두 카드를 합친 높이를 차지하고 하단에 일러스트가 깔린다 */
export const MailboxCard = styled.button`
  ${cardStyles}
  grid-row: span 2;
  min-height: 170px;
  overflow: hidden;
`;

export const CardHeader = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 4px;
`;

export const CardTitle = styled.span`
  flex: 1;
  ${setTypography(typography.paragraph.p2)};
  color: ${theme.colors.base.black};
  letter-spacing: -0.32px;
`;

export const CardChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${theme.colors.base.black};
`;

export const CardDescription = styled.span`
  padding-left: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${theme.colors.gray[700]};
  letter-spacing: -0.24px;
  white-space: pre-line;
`;

/** 시안(11366:18347)은 125x124 박스에 이미지를 세로로 넘치게 넣고 아래를 잘라낸다 */
export const MailboxIllustration = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 125px;
  height: 124px;
  object-fit: cover;
  object-position: top;
  pointer-events: none;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
  padding-top: 40px;
`;

const rowStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 38px;
  padding: 7px 12px;
  border: none;
  border-radius: 12px;
  background: none;
  ${setTypography(typography.paragraph.p3)};
  color: ${theme.colors.base.black};
  letter-spacing: -0.32px;
  text-decoration: none;
  cursor: pointer;
`;

export const InfoLink = styled.a`
  ${rowStyles}
`;

export const InfoRow = styled.div`
  ${rowStyles}
  cursor: default;
`;

export const Divider = styled.hr`
  height: 0;
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.colors.gray[300]};
`;

export const VersionText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.colors.base.black};
`;

export const AdminButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  margin-top: 12px;
  padding: 7px 12px;
  border: none;
  border-radius: 12px;
  background: ${theme.colors.gray[500]};
  ${setTypography(typography.paragraph.p3)};
  color: ${theme.colors.base.white};
  letter-spacing: -0.32px;
  cursor: pointer;
`;

export const AdminChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${theme.colors.base.white};
`;
