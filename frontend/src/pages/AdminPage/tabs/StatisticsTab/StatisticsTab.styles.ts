import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;

  ${media.tablet} {
    gap: 32px;
    padding: 20px;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  ${setTypography(typography.title.title6)}
  color: ${colors.gray[900]};
`;

export const SectionDescription = styled.p`
  margin: 0;
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[600]};
`;

export const Panel = styled.div`
  border: 1px solid ${colors.gray[300]};
  border-radius: 12px;
  padding: 20px;
  background: ${colors.base.white};

  ${media.tablet} {
    padding: 16px;
  }
`;

export const FeedbackBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 160px;
  gap: 12px;
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)}
`;

export const RetryButton = styled.button`
  width: fit-content;
  height: 36px;
  padding: 0 14px;
  border: 1px solid ${colors.gray[400]};
  border-radius: 10px;
  background: ${colors.base.white};
  color: ${colors.gray[800]};
  ${setTypography(typography.button.button1)}
  cursor: pointer;

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const QuickButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const QuickButton = styled.button<{ $active: boolean }>`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ $active }) => ($active ? colors.primary[800] : colors.gray[300])};
  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.base.white};
  color: ${({ $active }) => ($active ? colors.base.white : colors.gray[800])};
  ${setTypography(typography.button.button1)}
  cursor: pointer;
`;

export const DateInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  ${media.mobile} {
    width: 100%;
  }
`;

export const DateInput = styled.input`
  height: 40px;
  min-width: 138px;
  padding: 0 10px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  color: ${colors.gray[900]};
  ${setTypography(typography.paragraph.p5)}

  ${media.mobile} {
    min-width: 0;
    width: 100%;
    flex: 1 1 0;
  }
`;

export const DateSeparator = styled.span`
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p6)}
`;

export const ValidationText = styled.p`
  width: 100%;
  margin: 2px 0 0;
  color: ${colors.primary[900]};
  ${setTypography(typography.paragraph.p7)}
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  min-height: 104px;
  padding: 18px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
`;

export const MetricLabel = styled.span`
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)}
`;

export const MetricValue = styled.strong`
  color: ${colors.gray[900]};
  ${setTypography(typography.title.title3)}
`;

export const MetricUnit = styled.span`
  margin-left: 4px;
  color: ${colors.gray[700]};
  ${setTypography(typography.paragraph.p5)}
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 320px;

  ${media.tablet} {
    height: 260px;
  }
`;

export const TooltipBox = styled.div`
  min-width: 160px;
  padding: 10px 12px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  background: ${colors.base.white};
  box-shadow: 0 4px 16px rgba(17, 17, 17, 0.08);
`;

export const TooltipTitle = styled.p`
  margin: 0 0 8px;
  color: ${colors.gray[900]};
  ${setTypography(typography.paragraph.p5)}
`;

export const TooltipRow = styled.p`
  margin: 4px 0 0;
  color: ${colors.gray[700]};
  ${setTypography(typography.paragraph.p7)}
`;

export const KeywordList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const KeywordItem = styled.li`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;

  ${media.mobile} {
    grid-template-columns: 28px minmax(0, 1fr);
  }
`;

export const KeywordRank = styled.span`
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)}
`;

export const KeywordBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const KeywordText = styled.span`
  color: ${colors.gray[900]};
  ${setTypography(typography.paragraph.p5)}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const KeywordBarTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: ${colors.gray[200]};
  overflow: hidden;
`;

export const KeywordBar = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  border-radius: inherit;
  background: ${colors.accent[2][900]};
`;

export const KeywordCount = styled.strong`
  color: ${colors.gray[800]};
  ${setTypography(typography.paragraph.p5)}

  ${media.mobile} {
    grid-column: 2;
    justify-self: flex-start;
    color: ${colors.gray[600]};
  }
`;
