import type { ReactNode } from 'react';
import * as Styled from './CalendarLinkSection.styles';

interface CalendarLinkSectionProps {
  /** CalendarLinkCard 목록 */
  children: ReactNode;
}

const CalendarLinkSection = ({ children }: CalendarLinkSectionProps) => (
  <Styled.Section>
    <Styled.Heading>일정 연동하기</Styled.Heading>
    <Styled.Cards>{children}</Styled.Cards>
  </Styled.Section>
);

export default CalendarLinkSection;
